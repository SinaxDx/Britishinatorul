const chatHistory = [];
const HISTORY_LIMIT = 20; // Last 10 interactions (user + bot = 2 messages per interaction)

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
}
