import "server-only";
import { getServerEnv } from "@/lib/env";
import { AnthropicProvider } from "./anthropicProvider";
import { OpenAIProvider } from "./openaiProvider";
import type { AIProvider } from "./types";

let cached: AIProvider | null = null;

/** Selected by AI_PROVIDER env var — see .env.example. */
export function getAIProvider(): AIProvider {
  if (cached) return cached;

  const env = getServerEnv();
  if (env.AI_PROVIDER === "openai") {
    if (!env.OPENAI_API_KEY) {
      throw new Error("AI_PROVIDER=openai but OPENAI_API_KEY is not set.");
    }
    cached = new OpenAIProvider(env.OPENAI_API_KEY);
  } else {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error("AI_PROVIDER=anthropic but ANTHROPIC_API_KEY is not set.");
    }
    cached = new AnthropicProvider(env.ANTHROPIC_API_KEY);
  }
  return cached;
}
