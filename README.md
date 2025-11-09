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

## 4. Install Dependencies
```pwsh
npm install discord.js dotenv
```

## 5. Run the Bot
```pwsh
npm start
```
You should see `Ready! Logged in as <botname>`.

Type `!ping` in a guild channel where the bot is present; it should reply `Pong!`.

## 5.1 Invite the Bot to Your Server
1. In the Developer Portal, go to your application -> OAuth2 -> URL Generator.
2. Scopes: check `bot`.
3. Bot Permissions: check `Send Messages`, `Read Message History`, and if you enabled the text `!ping` example, also ensure `Message Content` intent is enabled in the Bot tab.
4. Copy the generated URL and open it in your browser to invite the bot to your test server.

## 6. Slash Commands
We now include a `/ping` slash command.

### 6.1 Deploy Commands
Set `DISCORD_GUILD_ID` in `.env` for fast development (guild-scoped shows instantly). Then run:
```pwsh
npm run register:cmds
```
If you omit `DISCORD_GUILD_ID`, commands are global and can take up to an hour to appear.

### 6.2 Use the Command
In Discord, type `/ping` and you should get `Pong! (slash)`.

### 6.3 Updating Commands
Edit `src/register-commands.js`, re-run the register script. Removing a command = remove from array and re-run.

## 7. Next Steps / Roadmap
- Add a slash command deploy script.
- Use a command handler structure (e.g., `src/commands/` folder).
- Add logging + error handling.
- Persist configuration or data (SQLite / Prisma / JSON file for small projects).
- Containerize with a `Dockerfile` if you plan to deploy.

## 8. Safety
Even for private usage, avoid sharing your token publicly (it grants full bot control). Keep `.env` out of version control and regenerate the token if you suspect exposure.

Happy hacking!
