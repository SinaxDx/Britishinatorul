# How It Works: Britishinatorul Bot

This document provides a detailed overview of the Britishinatorul Discord bot, its architecture, functionality, and configuration.

## Project Overview

Britishinatorul is a NodeJS-based Discord bot designed to serve as a polite and refined AI assistant. It connects to a local Large Language Model (LLM) provider (such as Ollama or LM Studio) using an OpenAI-compatible API. The bot is designed to handle text-based queries with a persistent "British" persona and context-aware conversations.

## Core Features

### 1. AI Integration
The bot uses the `openai` NPM package to communicate with a local AI server.
-   **Model**: Configurable via `.env` (default: `claude-haiku-4.5` or `llama3`).
-   **Persona**: The system prompt defines the bot as a "polite and refined British assistant who is helpful, concise, and charming."
-   **Memory**: The bot maintains a short-term memory of the last **20 messages** (10 user queries + 10 bot responses). This allows for conversational continuity.
-   **Context**: Each user prompt is prefixed with the user's username (e.g., `User Anton: Hello`) so the AI knows who it is talking to.
-   **Endpoint**: Connects to `http://localhost:11434/v1` by default.

### 2. Concurrency Control (Busy State)
To prevent the local AI backend from being overwhelmed, the bot implements a simple locking mechanism:
-   **Single-Threaded Logic**: The bot processes only **one `/ask` command at a time**.
-   **Busy Response**: If a user tries to use `/ask` while the bot is generating a response for someone else, it will instantly reply with: *"I am currently attending to another matter. Please wait a moment, darling."*

### 3. Commands
The bot uses Discord's Slash Command (`/`) system.
-   **/ask [prompt]**: The primary command to interact with the AI.
-   **/test**: A simple health check command that replies "Working ✅" to confirm the bot is online and responsive.

### 4. Technical Constraints
-   **Response Length**: Discord has a 2000-character limit per message. The bot truncates responses at 1900 characters to ensure safe delivery.
-   **Token Limit**: The AI generation is limited to `256` tokens to ensure faster "thinking" speeds (configurable in `.env`).

## Architecture & File Structure

-   **`src/index.js`**: The main entry point.
    -   Initializes the Discord Client.
    -   Handles the `InteractionCreate` event.
    -   Manages the bot "Busy" state.
-   **`src/utils/`**: Helper modules to keep the code clean.
    -   **`envLoader.js`**: Robustly loads environment variables, handling Windows/Path issues.
    -   **`logger.js`**: Replaces the default console logging with a dual-system (console + persistent file log in `logs/`).
    -   **`chatHistory.js`**: Manages the persistent chat history array (adding messages, trimming to limit).
-   **`src/aiClient.js`**: A wrapper for the OpenAI API.
    -   Constructs the message payload (System Prompt + History + User Prompt).
    -   Handles errors and offline states.
-   **`src/register-commands.js`**: A utility script to register slash commands with Discord's API. This must be run whenever command definitions change.
-   **`.env`**: Configuration file for secrets and settings.
-   **`start_all.bat`**: A simple Windows batch script to start the bot via `npm start`.

## Logging

The bot features a comprehensive logging system.
-   **Console**: Live output is shown in the terminal.
-   **File**: All output (INFO, ERROR, DEBUG) is mirrored to timestamped files in the `logs/` directory (e.g., `logs/session-2026-01-08....log`).
-   **Startup Logs**: `start_all.bat` also captures early startup errors to `logs/console_....log`.

## Configuration

Configuration is split into two files:

1.  **`.env`**: For sensitive connection details.
2.  **`botConfig.json`**: For behavior and performance tuning.

### `.env` (Secrets)
| Variable | Description |
| :--- | :--- |
| `DISCORD_TOKEN` | Your Discord Bot Token |
| `DISCORD_CLIENT_ID` | Your Application ID |
| `OPENAI_BASE_URL` | URL of the local AI provider (`http://localhost:11434/v1`) |

### `botConfig.json` (Performance & Behavior)
Located in the root folder, this file allows easy editing of:
```json
{
  "performance": {
    "model": "llama3",       // The AI model to use
    "maxTokens": 256,        // Shorter = faster response
    "historyLimit": 20       // How many past messages to remember
  },
  "personality": {
    "systemPrompt": "..."    // Define how the bot acts
  }
}
```

## Setup & Usage

1.  **Prerequisites**:
    -   Node.js installed (v18+).
    -   A local AI provider running (e.g., Ollama) serving the configured model.
2.  **Installation**:
    -   Run `npm install` to install dependencies (`discord.js`, `dotenv`, `openai`).
3.  **Configuration**:
    -   Ensure `.env` allows connection to your local AI.
4.  **Register Commands**:
    -   Run `npm run register:cmds` once to register `/ask` and `/test`.
5.  **Start**:
    -   Run `start_all.bat` or `npm start`.

## Future Considerations
-   **Media Generation**: Previous media capabilities (Image/Video) have been removed to focus purely on text interaction.
-   **History**: Currently, history is global (shared across all users in the channel/server who use the bot).
