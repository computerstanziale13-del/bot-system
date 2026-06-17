import { REST, Routes } from 'discord.js';
import * as ssu from './commands/ssu';
import * as ssd from './commands/ssd';
import * as setup_ticket from './commands/setup_ticket';
import * as setup_staff from './commands/setup_staff';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  console.error('Mancano le variabili d\'ambiente: DISCORD_TOKEN, DISCORD_CLIENT_ID');
  process.exit(1);
}

const commands = [ssu.data.toJSON(), ssd.data.toJSON(), setup_ticket.data.toJSON(), setup_staff.data.toJSON()];
const rest = new REST().setToken(token);

function isSnowflake(value: string): boolean {
  return /^\d{17,20}$/.test(value);
}

(async () => {
  try {
    if (guildId && isSnowflake(guildId)) {
      console.log(`Registrazione di ${commands.length} comando/i sul server ${guildId}...`);
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      ) as unknown[];
      console.log(`✅ ${data.length} comando/i registrato/i sul server (istantaneo).`);
    } else {
      console.log(`Registrazione di ${commands.length} comando/i globalmente...`);
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      ) as unknown[];
      console.log(`✅ ${data.length} comando/i registrato/i globalmente (attivo entro ~1 ora).`);
    }
  } catch (error) {
    console.error('Errore durante la registrazione dei comandi:', error);
  }
})();
