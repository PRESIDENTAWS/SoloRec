import "server-only";
import type { AIProvider, GenerateObjectInput, GenerateTextInput, GenerateTextResult } from "./types";

const API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o";

interface OpenAIToolCall {
  id: string;
  function: { name: string; arguments: string };
}

interface OpenAIResponse {
  choices: Array<{ message: { content: string | null; tool_calls?: OpenAIToolCall[] } }>;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number };
  error?: { message: string };
}

async function callOpenAI(body: Record<string, unknown>, apiKey: string): Promise<OpenAIResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const json = (await response.json()) as OpenAIResponse;
  if (!response.ok) {
    throw new Error(`OpenAI API error (${response.status}): ${json.error?.message ?? "unknown error"}`);
  }
  return json;
}

export class OpenAIProvider implements AIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = DEFAULT_MODEL
  ) {}

  async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
    const messages = [
      ...(input.system ? [{ role: "system", content: input.system }] : []),
      { role: "user", content: input.prompt }
    ];

    const response = await callOpenAI(
      {
        model: this.model,
        max_tokens: input.maxTokens ?? 1024,
        temperature: input.temperature ?? 0.3,
        messages
      },
      this.apiKey
    );

    return {
      text: response.choices[0]?.message.content ?? "",
      model: response.model,
      inputTokens: response.usage?.prompt_tokens,
      outputTokens: response.usage?.completion_tokens
    };
  }

  async generateObject<T>(input: GenerateObjectInput<T>): Promise<T> {
    const messages = [
      ...(input.system ? [{ role: "system", content: input.system }] : []),
      { role: "user", content: input.prompt }
    ];

    const response = await callOpenAI(
      {
        model: this.model,
        max_tokens: input.maxTokens ?? 1024,
        temperature: input.temperature ?? 0.2,
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: input.toolName,
              description: "Return the result as structured data matching this schema.",
              parameters: input.jsonSchema
            }
          }
        ],
        tool_choice: { type: "function", function: { name: input.toolName } }
      },
      this.apiKey
    );

    const toolCall = response.choices[0]?.message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("OpenAI did not return a tool call for a structured-output request.");
    }

    let parsedArguments: unknown;
    try {
      parsedArguments = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("OpenAI returned malformed JSON for a structured-output request.");
    }

    // Never trust arbitrary model output directly — validate before returning.
    return input.schema.parse(parsedArguments);
  }
}
