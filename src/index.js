import './utils/envLoader.js';
import './utils/logger.js';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { generateAIResponse } from './aiClient.js';
import { getChatHistory, addToHistory } from './utils/chatHistory.js';

// Guard: ensure token present before trying to log in.
if (!process.env.DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN. Set it in a .env file (see .env.example).');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// Optional verbose logging controlled by DEBUG env
if (process.env.DEBUG === 'true') {
  client.on(Events.Debug, (d) => console.debug('[debug]', d));
}
client.on(Events.Warn, (w) => console.warn('[warn]', w));
client.on(Events.Error, (e) => console.error('[error]', e));

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// State for concurrency and memory
let isBusy = false;

// Handle slash command interactions ("/ping")
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ask') {
      if (isBusy) {
        await interaction.reply({ content: 'I am currently attending to another matter. Please wait a moment, darling.', ephemeral: true });
        return;
      }
      isBusy = true;
      try {
        const prompt = interaction.options.getString('prompt');
        const username = interaction.user.username;
        // Format prompt to include username for context
        const userContent = `User ${username}: ${prompt}`;
        
        await interaction.deferReply(); // allow time for AI
        
        // Prepare messages: history + current prompt
        // Note: System prompt is prepended in generateAIResponse
        const messages = [...getChatHistory(), { role: 'user', content: userContent }];
        
        const answer = await generateAIResponse(messages);
        
        // Update history
        addToHistory(userContent, answer);

        // Truncate extremely long answers for safety
        const MAX_LEN = 1900; // Discord message limit buffer
        const display = answer.length > MAX_LEN ? answer.slice(0, MAX_LEN) + '…' : answer;
        await interaction.editReply(display);
      } finally {
        isBusy = false;
      }
    } else if (interaction.commandName === 'test') {
      await interaction.reply({ content: 'Working ✅', ephemeral: false });
    }
  } catch (err) {
    console.error('Failed handling interaction:', err);
    if (interaction.isRepliable()) {
      try { await interaction.reply({ content: 'Error executing command.', ephemeral: true }); } catch {}
    }
    isBusy = false; // Ensure lock is released on error
  }
});

client.login(process.env.DISCORD_TOKEN);
