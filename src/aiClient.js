import 'dotenv/config';
import OpenAI from 'openai';
import config from './utils/configLoader.js';

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

// Configs from botConfig.json (with env fallback handled in loader)
const DEFAULT_MODEL = config.performance.model;
const MAX_TOKENS = config.performance.maxTokens;
const SYSTEM_PROMPT = config.personality.systemPrompt;

export async function generateAIResponse(messagesOrPrompt) {
  if (!client) {
    return 'Offline AI not configured. Set OPENAI_BASE_URL (and model) in .env.';
  }

  let messages = [];
  if (typeof messagesOrPrompt === 'string') {
     if (!messagesOrPrompt || !messagesOrPrompt.trim()) {
        return 'Please provide a prompt.';
     }
     messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: messagesOrPrompt }
     ];
  } else if (Array.isArray(messagesOrPrompt)) {
     messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messagesOrPrompt
     ];
  } else {
     return 'Invalid input.';
  }

  try {
    const completion = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      max_tokens: MAX_TOKENS,
      messages: messages
    });
    const choice = completion.choices?.[0];
    return choice?.message?.content?.trim() || 'Empty response.';
  } catch (err) {
    console.error('OpenAI error:', err);
    if (err?.response?.status === 401) return 'Auth error: invalid or missing OPENAI_API_KEY';
    return 'AI request failed.';
  }
}
