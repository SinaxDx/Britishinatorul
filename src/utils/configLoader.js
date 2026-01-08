import fs from 'fs';
import path from 'path';

const configPath = path.resolve(process.cwd(), 'botConfig.json');

// Default configuration matches standard Ollama usage
const defaultConfig = {
    performance: {
        model: 'llama3',
        maxTokens: 256,
        historyLimit: 20
    },
    personality: {
        systemPrompt: "You are a polite and refined British assistant who is helpful, concise, and charming."
    }
};

let userConfig = {};

try {
    if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        userConfig = JSON.parse(fileContent);
    }
} catch (err) {
    console.error('[Config] Failed to load botConfig.json, simply using defaults/env:', err);
}

// Merge defaults with user config
const config = {
    performance: {
        ...defaultConfig.performance,
        ...(userConfig.performance || {})
    },
    personality: {
        ...defaultConfig.personality,
        ...(userConfig.personality || {})
    }
};

export default config;
