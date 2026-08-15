import "server-only";
import type { AIProvider, GenerateObjectInput, GenerateTextInput, GenerateTextResult } from "./types";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-5";

interface AnthropicContentBlock {
  type: string;
  text?: string;
  input?: unknown;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
  model: string;
  usage?: { input_tokens: number; output_tokens: number };
  error?: { message: string };
}

async function callAnthropic(body: Record<string, unknown>, apiKey: string): Promise<AnthropicResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": API_VERSION
    },
    body: JSON.stringify(body)
  });

  const json = (await response.json()) as AnthropicResponse;
  if (!response.ok) {
    throw new Error(`Anthropic API error (${response.status}): ${json.error?.message ?? "unknown error"}`);
  }
  return json;
}

export class AnthropicProvider implements AIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = DEFAULT_MODEL
  ) {}

  async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
    const response = await callAnthropic(
      {
        model: this.model,
        max_tokens: input.maxTokens ?? 1024,
        temperature: input.temperature ?? 0.3,
        ...(input.system ? { system: input.system } : {}),
        messages: [{ role: "user", content: input.prompt }]
      },
      this.apiKey
    );

    const text = response.content.find((block) => block.type === "text")?.text ?? "";
    return {
      text,
      model: response.model,
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens
    };
  }

  async generateObject<T>(input: GenerateObjectInput<T>): Promise<T> {
    const response = await callAnthropic(
      {
        model: this.model,
        max_tokens: input.maxTokens ?? 1024,
        temperature: input.temperature ?? 0.2,
        ...(input.system ? { system: input.system } : {}),
        messages: [{ role: "user", content: input.prompt }],
        tools: [
          {
            name: input.toolName,
            description: `Return the result as structured data matching this schema.`,
            input_schema: input.jsonSchema
          }
        ],
        tool_choice: { type: "tool", name: input.toolName }
      },
      this.apiKey
    );

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (!toolUse) {
      throw new Error("Anthropic did not return a tool_use block for a structured-output request.");
    }

    // Never trust arbitrary model output directly — validate before returning.
    return input.schema.parse(toolUse.input);
  }
}
