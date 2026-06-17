import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'config.json');
const PING_ROLE = '1502916988694040647';

interface SSDLog {
  user: string;
  userId: string;
  timestamp: string;
}

interface ConfigData {
  ssd_log?: SSDLog[];
}

function loadConfig(): ConfigData {
  if (!fs.existsSync(dataPath)) return { ssd_log: [] };
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function saveConfig(data: ConfigData) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

export const data = new SlashCommandBuilder()
  .setName('ssd')
  .setDescription('Annuncia che il server è offline (SSD — Server Shut Down)');

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('SSD — Server Shut Down')
    .setColor(0xff0000)
    .setDescription(
      `┌ **Stato**\n╰ **OFFLINE**\n\n` +
      `┌ **Moderazione**\n╰ **Terminata**\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Il server è stato chiuso.\nGrazie a tutti per aver giocato!\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `┌ **Gestito da**\n╰ ${interaction.user}`
    );

  // Invio della risposta
  await interaction.reply({
    content: `<@&${PING_ROLE}>`,
    embeds: [embed],
  });

  // Gestione log (usando il percorso corretto)
  const config = loadConfig();
  if (!config.ssd_log) config.ssd_log = [];
  
  config.ssd_log.push({
    user: interaction.user.tag,
    userId: interaction.user.id,
    timestamp: new Date().toISOString(),
  });
  
  saveConfig(config);
}
