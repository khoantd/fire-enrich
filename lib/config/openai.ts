/**
 * OpenAI / LLM configuration (env-driven).
 * Used for model selection when using OpenAI or an OpenAI-compatible proxy (e.g. LiteLLM).
 */

const DEFAULT_MODEL = 'gpt-5';
const DEFAULT_MODEL_MINI = 'gpt-5-mini';

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
}

export function getOpenAIModelMini(): string {
  return process.env.OPENAI_MODEL_MINI ?? DEFAULT_MODEL_MINI;
}
