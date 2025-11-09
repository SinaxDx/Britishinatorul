import 'dotenv/config';
import { Client, GatewayIntentBits, Events, InteractionType } from 'discord.js';

// Guard: ensure token present before trying to log in.
if (!process.env.DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN. Set it in a .env file (see .env.example).');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
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

// Simple text command example: reply to !ping
client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

// Handle slash command interactions ("/ping")
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') {
      await interaction.reply({ content: 'Pong! (slash)', ephemeral: false });
    }
  } catch (err) {
    console.error('Failed handling interaction:', err);
    if (interaction.isRepliable()) {
      try { await interaction.reply({ content: 'Error executing command.', ephemeral: true }); } catch {}
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
