import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Robust environment loading: if dotenv fails, try manual parsing
// This often happens in some Windows environments or specific shell contexts
if (!process.env.DISCORD_TOKEN) {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    try {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val && key.trim() === 'DISCORD_TOKEN') {
            process.env.DISCORD_TOKEN = val.trim();
        }
        });
    } catch (err) {
        console.error('Failed manual .env load', err);
    }
  }
}
