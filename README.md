# Britishinatorul Discord Bot

A polite and refined AI assistant bot for Discord, designed to run with local LLMs (like Ollama).

## Features
*   **Local AI Integration**: Connects to generic OpenAI-compatible endpoints (Ollama, LM Studio).
*   **British Persona**: Configured to be helpful, concise, and charmingly British.
*   **Conversational Memory**: Remembers the last 10 interactions for context-aware replies.
*   **Concurrency Control**: Handles one request at a time to prevent overloading your local hardware.
*   **Logging**: Full file-based logging in the logs/ directory.

## Quick Start

1.  **Prerequisites**:
    *   Node.js 18+ installed.
    *   A Discord Bot Token.
    *   Ollama (or similar) running locally.

2.  **Setup**:
    *   Run 
pm install.
    *   Copy .env.example to .env and fill in your details (DISCORD_TOKEN, DISCORD_CLIENT_ID).
    *   Ensure your OPENAI_MODEL in .env matches a model you have locally (e.g., llama3).

3.  **Commands**:
    *   Run 
pm run register:cmds to register the slash commands.
    *   /ask <prompt>: Chat with the bot.
    *   /test: Check if the bot is online.

4.  **Run**:
    *   Double-click start_all.bat or run 
pm start.

## Documentation
For detailed architecture and internal workings, see [HOW_IT_WORKS.md](HOW_IT_WORKS.md).
