import type { ZodType } from "zod";

export interface GenerateTextInput {
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateTextResult {
  text: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface GenerateObjectInput<T> {
  system?: string;
  prompt: string;
  /** Validates the parsed result at runtime — never trust raw model output directly. */
  schema: ZodType<T>;
  /**
   * Hand-authored JSON Schema describing the same shape as `schema`, passed
   * to the provider's tool-use / structured-output mechanism. Kept separate
   * from `schema` rather than auto-derived from it, to avoid adding a
   * zod-to-json-schema dependency for what is currently one fixed shape
   * (see promptContext.ts) — see docs/AI_AGENT_ARCHITECTURE.md.
   */
  jsonSchema: Record<string, unknown>;
  toolName: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Every AI call in the app goes through this interface — no workflow
 * imports an Anthropic or OpenAI SDK/fetch call directly. Swapping
 * providers, or adding a third, never touches calling code.
 */
export interface AIProvider {
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
  generateObject<T>(input: GenerateObjectInput<T>): Promise<T>;
}
