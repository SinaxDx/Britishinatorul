# Britishinatorul Discord Bot

A minimal starting point for a Discord bot using `discord.js` (ES modules) on Node 18+.

## 1. Prerequisites
- Node.js 18.17+ (LTS recommended)
- A Discord account

## 2. Create the Application & Bot
1. Go to https://discord.com/developers/applications
2. New Application -> name it.
3. Bot tab -> *Add Bot*.
4. Under *Privileged Gateway Intents* enable:
   - MESSAGE CONTENT INTENT (since we read message content for `!ping`)
5. Copy the **Bot Token** (you'll paste this into `.env`).

## 3. Set Up Environment File
Copy `.env.example` to `.env` and fill values:
```
DISCORD_TOKEN=YOUR_BOT_TOKEN
DISCORD_CLIENT_ID=YOUR_APPLICATION_CLIENT_ID
DISCORD_GUILD_ID=OPTIONAL_TEST_GUILD_ID
```

# Britishinatorul Discord Bot (Offline AI Edition)

Minimal Discord bot using `discord.js` with ONLY slash commands and an offline/local AI integration (Ollama / LM Studio). No cloud token usage required.

## 1. Requirements
- Node.js 18.17+
- Discord application + bot token
- Local AI server exposing OpenAI-compatible API (e.g. Ollama)

## 2. Create the Bot
1. Visit https://discord.com/developers/applications
2. Create Application -> Bot -> Add Bot
3. Copy the bot token (put in `.env`)
4. Scopes for invite URL: `bot` `applications.commands`
5. Permissions: basic send/read or Administrator if private

## 3. Environment Setup
Copy `.env.example` to `.env` and fill in:
```
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
DISCORD_CLIENT_ID=YOUR_APPLICATION_CLIENT_ID
DISCORD_GUILD_ID=YOUR_TEST_GUILD_ID   # recommended for instant command updates
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=ollama
OPENAI_MODEL=llama3
AI_MAX_TOKENS=400
AI_SYSTEM_PROMPT=You are a helpful assistant inside a private Discord server.
```

## 4. Install Dependencies
```pwsh
npm install
```

## 5. Register Slash Commands
```pwsh
npm run register:cmds
```
Guild-scoped commands appear instantly. Omit `DISCORD_GUILD_ID` for global (may take up to 1 hour).

## 6. Start the Bot
```pwsh
npm start
```
Log message: `Ready! Logged in as <botname>`.

## 7. Available Commands
- `/ask prompt:<text>` — Sends the prompt to your local text model and returns its answer.
- `/image prompt:<text> [width|height|steps|cfg|sampler|negative]` — Generates an image via Automatic1111.
- `/video prompt:<text>` — Calls a custom local video API (optional; see config).

## 8. Local AI (Ollama Example)
1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama run llama3`
3. Ensure Ollama API is reachable at `http://localhost:11434/v1`
4. Adjust `OPENAI_MODEL` to match the model tag (e.g. `llama3`, `llama3.1:8b`).

### Local Image Generation (Automatic1111)
1. Install SD WebUI: https://github.com/AUTOMATIC1111/stable-diffusion-webui
2. Launch with API enabled (e.g., `webui-user.bat` includes `set COMMANDLINE_ARGS=--api`).
3. Ensure it's reachable at `http://127.0.0.1:7860` (default) and configured in `.env`.

### Performance Tips
- Lower `AI_MAX_TOKENS` if responses are slow.
- Smaller models reduce RAM/VRAM usage.
- Keep prompts concise for faster replies.
 - For images, reduce `IMAGE_STEPS` or resolution (width/height) if it's too slow.

## 9. Customizing AI Behavior
- Edit `AI_SYSTEM_PROMPT` in `.env` for personality changes.
- You can layer context manually by prepending text to the user prompt.

## 10. Updating Commands
Modify `src/register-commands.js`, then rerun:
```pwsh
npm run register:cmds
```
Removing a command: delete its builder from the array and re-register.

## 11. Security & Privacy
- Bot token = full control of your bot; rotate if shared inadvertently.
- Local AI means prompts never leave your machine (unless your local server proxies externally).
- Avoid committing `.env`.

## 12. Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| `/ask` returns offline not configured | Missing `OPENAI_BASE_URL` | Set URL and restart bot |
| Very slow responses | Large model / high tokens | Use smaller model or reduce `AI_MAX_TOKENS` |
| Commands not visible | Not registered / global delay | Set `DISCORD_GUILD_ID` and re-run register |
| Interaction error logs | Model/server unreachable | Verify local server is running |

## 13. Next Ideas
- Add conversation memory (store recent turns per channel).
- Add moderation filters for prompts.
- Add rate limiting per user.

Enjoy building! Offline AI, full control, minimal surface area.
