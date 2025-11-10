import 'dotenv/config';
import { Client, GatewayIntentBits, Events, AttachmentBuilder } from 'discord.js';
import { generateAIResponse } from './aiClient.js';
import { generateImageTxt2Img, generateVideo } from './mediaClient.js';

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

// Removed legacy message-based ping handler (offline AI build is slash-only)

// Handle slash command interactions ("/ping")
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ask') {
      const prompt = interaction.options.getString('prompt');
      await interaction.deferReply(); // allow time for AI
      const answer = await generateAIResponse(prompt);
      // Truncate extremely long answers for safety
      const MAX_LEN = 1900; // Discord message limit buffer
      const display = answer.length > MAX_LEN ? answer.slice(0, MAX_LEN) + '…' : answer;
      await interaction.editReply(display);
    } else if (interaction.commandName === 'test') {
      await interaction.reply({ content: 'Working ✅', ephemeral: false });
    } else if (interaction.commandName === 'image') {
      const prompt = interaction.options.getString('prompt');
      const width = interaction.options.getInteger('width') || undefined;
      const height = interaction.options.getInteger('height') || undefined;
      const steps = interaction.options.getInteger('steps') || undefined;
      const cfg = interaction.options.getNumber('cfg') || undefined;
      const sampler = interaction.options.getString('sampler') || undefined;
      const negative = interaction.options.getString('negative') || undefined;
      await interaction.deferReply();
      const result = await generateImageTxt2Img({
        prompt,
        negativePrompt: negative,
        width, height, steps, cfgScale: cfg, sampler
      });
      if (!result.ok) {
        await interaction.editReply(`Image generation failed: ${result.error}`);
        return;
      }
      const file = new AttachmentBuilder(result.buffer, { name: result.filename || 'image.png' });
      await interaction.editReply({ content: prompt ? `Prompt: ${prompt}` : undefined, files: [file] });
    } else if (interaction.commandName === 'video') {
      const prompt = interaction.options.getString('prompt');
      await interaction.deferReply();
      const result = await generateVideo({ prompt });
      if (!result.ok) {
        await interaction.editReply(`Video generation not available: ${result.error}`);
        return;
      }
      const file = new AttachmentBuilder(result.buffer, { name: result.filename || 'video.mp4' });
      await interaction.editReply({ content: prompt ? `Prompt: ${prompt}` : undefined, files: [file] });
    }
  } catch (err) {
    console.error('Failed handling interaction:', err);
    if (interaction.isRepliable()) {
      try { await interaction.reply({ content: 'Error executing command.', ephemeral: true }); } catch {}
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
