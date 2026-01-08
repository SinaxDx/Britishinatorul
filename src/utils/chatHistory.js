import fs from 'fs';
import path from 'path';
import config from './configLoader.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
// Ensure data dir exists (though main logic creates it, good to double check)
if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

const CACHE_FILE = path.join(DATA_DIR, 'chatHistory.json');

let chatHistory = [];
const HISTORY_LIMIT = config.performance.historyLimit; 

// Initial Load
try {
    if (fs.existsSync(CACHE_FILE)) {
        const raw = fs.readFileSync(CACHE_FILE, 'utf8');
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
            chatHistory = data;
        }
    }
} catch (err) {
    console.error('[ChatHistory] Failed to load cache:', err);
}

function saveCache() {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(chatHistory, null, 2));
    } catch (err) {
        console.error('[ChatHistory] Failed to save cache:', err);
    }
}

/**
 * Returns a copy of the current chat history.
 */
export function getChatHistory() {
    return [...chatHistory];
}

/**
 * Adds a user and assistant message pair to the history, enforcing limits.
 * @param {string} userContent - The formatted user prompt (e.g. "User X: ...")
 * @param {string} assistantContent - The response from the AI
 */
export function addToHistory(userContent, assistantContent) {
    chatHistory.push({ role: 'user', content: userContent });
    chatHistory.push({ role: 'assistant', content: assistantContent });
    
    // Trim history if it exceeds limit
    if (chatHistory.length > HISTORY_LIMIT) {
        chatHistory.splice(0, chatHistory.length - HISTORY_LIMIT);
    }

    saveCache();
}
