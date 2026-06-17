import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  StringSelectMenuInteraction,
} from 'discord.js';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../../data/tickets.json');
const STAFF_ROLE = '1502644138170912860';

function loadTickets(): { counter: number; tickets: object[] } {
  if (!fs.existsSync(dataPath)) {
    return { counter: 0, tickets: [] };
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

function saveTickets(data: object) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

const categoryLabels: Record<string, string> = {
  ticket_gradi: 'Assistenza Gradi Alti',
  ticket_segnalazione: 'Segnalazione Utente',
  ticket_bug: 'Segnalazione Bug',
  ticket_discord: 'Assistenza Discord',
  ticket_game: 'Assistenza Game',
  ticket_partner: 'Richiesta Partnership',
};

export async function handleTicketSelect(interaction: StringSelectMenuInteraction) {
  const category = interaction.values[0];
  const label = categoryLabels[category] ?? category;
  const guild = interaction.guild;

  if (!guild) {
    await interaction.reply({ content: '\u274c Errore: guild non trovata.', ephemeral: true });
    return;
  }

  const data = loadTickets();
  data.counter += 1;
  const ticketNumber = String(data.counter).padStart(4, '0');

  await interaction.deferReply({ ephemeral: true });

  try {
    const channel = await guild.channels.create({
      name: `ticket-${ticketNumber}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: STAFF_ROLE,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ],
    });

    const embed = new EmbedBuilder()
      .setTitle(`\ud83d\udcc1 ${label}`)
      .setColor(0x0099ff)
      .setDescription(
        `Benvenuto ${interaction.user}!\n\n` +
          `Il tuo ticket \u00e8 stato creato.\nUno staff ti risponder\u00e0 al pi\u00f9 presto.\n\n` +
          `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n` +
          `**Categoria:** ${label}\n` +
          `**Ticket:** #${ticketNumber}\n` +
          `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
          `Descrivi il tuo problema qui sotto.`,
      )
      .setTimestamp();

    const rowButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('claim_ticket')
        .setLabel('\ud83c\udfab Claim')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('\ud83c\udfab'),
      new ButtonBuilder()
        .setCustomId('release_ticket')
        .setLabel('\ud83d\udd13 Rilascia')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('\ud83d\udd13'),
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('\u274c Chiudi')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('\u274c'),
    );

    await channel.send({
      content: `${interaction.user} <@&${STAFF_ROLE}>`,
      embeds: [embed],
      components: [rowButtons],
    });

    data.tickets.push({
      id: ticketNumber,
      category,
      label,
      userId: interaction.user.id,
      userTag: interaction.user.tag,
      channelId: channel.id,
      status: 'open',
      createdAt: new Date().toISOString(),
    });
    saveTickets(data);

    await interaction.editReply({
      content: `\u2705 Ticket aperto! Vai in ${channel}`,
    });
  } catch {
    await interaction.editReply({
      content: '\u274c Impossibile creare il ticket. Assicurati che il bot abbia il permesso di **Gestisci Canali**.',
    });
  }
}
