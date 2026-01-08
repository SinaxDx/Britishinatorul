import './utils/envLoader.js';
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
