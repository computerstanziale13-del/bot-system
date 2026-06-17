import { ButtonInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../../data/staff_log.json');

function loadLog(): { sessions: object[] } {
  if (!fs.existsSync(dataPath)) return { sessions: [] };
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

function saveLog(data: object) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function handleStartStaff(interaction: ButtonInteraction) {
  const log = loadLog();

  log.sessions.push({
    type: 'start',
    userId: interaction.user.id,
    userTag: interaction.user.tag,
    timestamp: new Date().toISOString(),
  });
  saveLog(log);

  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setDescription(
      `✅ **Servizio Iniziato**\n\n` +
        `┌ **Staff**\n╰ ${interaction.user}\n\n` +
        `┌ **Orario Inizio**\n╰ <t:${Math.floor(Date.now() / 1000)}:T>`,
    );

  await interaction.reply({ embeds: [embed] });
}

export async function handleEndStaff(interaction: ButtonInteraction) {
  const log = loadLog();

  log.sessions.push({
    type: 'end',
    userId: interaction.user.id,
    userTag: interaction.user.tag,
    timestamp: new Date().toISOString(),
  });
  saveLog(log);

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setDescription(
      `🔴 **Servizio Terminato**\n\n` +
        `┌ **Staff**\n╰ ${interaction.user}\n\n` +
        `┌ **Orario Fine**\n╰ <t:${Math.floor(Date.now() / 1000)}:T>`,
    );

  await interaction.reply({ embeds: [embed] });
}
