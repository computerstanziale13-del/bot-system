import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../../data/config.json');
const gifPath = path.join(__dirname, '../../assets/ssu.gif');

const PING_ROLE = '1502916988694040647';

function loadConfig() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function saveConfig(data: object) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

export const data = new SlashCommandBuilder()
  .setName('ssu')
  .setDescription('Annuncia che il server è online (SSU — Server Start UP)');

export async function execute(interaction: ChatInputCommandInteraction) {
  const config = loadConfig();
  const { name, code, status, moderation } = config.server;

  const attachment = new AttachmentBuilder(gifPath, { name: 'ssu.gif' });

  const embed = new EmbedBuilder()
    .setTitle('SSU — Server Start UP')
    .setColor(0x00ff00)
    .setImage('attachment://ssu.gif')
    .setDescription(
      `┌ **Stato**\n╰ **${status}**\n\n` +
        `┌ **Moderazione**\n╰ **${moderation}**\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `**Nome server :** ${name}\n\n` +
        `**Codice in Game :** ${code}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `Il membro staff vi aspetta in Game !\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `┌ **Gestito da**\n╰ ${interaction.user}`,
    );

  await interaction.reply({
    content: `<@&${PING_ROLE}> @everyone`,
    embeds: [embed],
    files: [attachment],
  });

  config.ssu_log.push({
    user: interaction.user.tag,
    userId: interaction.user.id,
    timestamp: new Date().toISOString(),
  });
  saveConfig(config);
}
