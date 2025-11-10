import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID; // optional for dev-only

if (!token || !clientId) {
  console.error('Missing DISCORD_TOKEN or DISCORD_CLIENT_ID in .env');
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask the AI a question')
    .addStringOption(o => o.setName('prompt').setDescription('Your question').setRequired(true)),
  new SlashCommandBuilder()
    .setName('test')
    .setDescription('Simple health check: confirms the bot is responding')
  ,
  new SlashCommandBuilder()
    .setName('image')
    .setDescription('Generate a local image from a prompt (Automatic1111)')
    .addStringOption(o => o.setName('prompt').setDescription('Image prompt').setRequired(true))
    .addIntegerOption(o => o.setName('width').setDescription('Width (e.g., 512)'))
    .addIntegerOption(o => o.setName('height').setDescription('Height (e.g., 512)'))
    .addIntegerOption(o => o.setName('steps').setDescription('Steps (e.g., 25)'))
    .addNumberOption(o => o.setName('cfg').setDescription('CFG scale (e.g., 7)'))
    .addStringOption(o => o.setName('sampler').setDescription('Sampler name'))
    .addStringOption(o => o.setName('negative').setDescription('Negative prompt'))
  ,
  new SlashCommandBuilder()
    .setName('video')
    .setDescription('Generate a local video from a prompt (requires custom local API)')
    .addStringOption(o => o.setName('prompt').setDescription('Video prompt').setRequired(true))
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

async function main() {
  try {
    if (guildId) {
      console.log(`Registering ${commands.length} command(s) to guild ${guildId}...`);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('Guild commands registered.');
    } else {
      console.log(`Registering ${commands.length} global command(s)... (may take up to 1 hour to appear)`);
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Global commands registered.');
    }
  } catch (err) {
    console.error('Failed to register commands:', err);
    process.exit(1);
  }
}

main();
