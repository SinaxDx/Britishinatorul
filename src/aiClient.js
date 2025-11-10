import 'dotenv/config';
import OpenAI from 'openai';

// Basic wrapper around OpenAI Chat Completions.
// Handles minimal validation & allows system prompt override via env.

const apiKey = process.env.OPENAI_API_KEY || 'ollama';
const baseURL = process.env.OPENAI_BASE_URL; // required for offline mode
if (!baseURL) {
  console.warn('OPENAI_BASE_URL not set. Offline AI will be disabled.');
}
let client;
if (baseURL) {
  client = new OpenAI({ apiKey, baseURL });
}

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS || '400', 10);
const SYSTEM_PROMPT = process.env.AI_SYSTEM_PROMPT || 'You are a helpful assistant.';

export async function generateAIResponse(userPrompt) {
  if (!client) {
    return 'Offline AI not configured. Set OPENAI_BASE_URL (and model) in .env.';
  }
  if (!userPrompt || !userPrompt.trim()) {
    return 'Please provide a prompt.';
  }
  try {
    const completion = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ]
    });
    const choice = completion.choices?.[0];
    return choice?.message?.content?.trim() || 'Empty response.';
  } catch (err) {
    console.error('OpenAI error:', err);
    if (err?.response?.status === 401) return 'Auth error: invalid or missing OPENAI_API_KEY';
    return 'AI request failed.';
  }
}
