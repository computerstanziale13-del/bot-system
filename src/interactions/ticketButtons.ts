import { ButtonInteraction, ChannelType, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../../data/tickets.json');

function loadTickets() {
  if (!fs.existsSync(dataPath)) return { counter: 0, tickets: [] };
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

function saveTickets(data: object) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

function findTicketByChannel(tickets: any[], channelId: string) {
  return tickets.find((t: any) => t.channelId === channelId);
}

export async function handleClaimTicket(interaction: ButtonInteraction) {
  const data = loadTickets();
  const ticket = findTicketByChannel(data.tickets, interaction.channelId!);
  if (!ticket) {
    await interaction.reply({ content: '❌ Ticket non trovato.', ephemeral: true });
    return;
  }

  if (ticket.claimedBy) {
    await interaction.reply({ content: `❌ Ticket già claimato da <@${ticket.claimedBy}>.`, ephemeral: true });
    return;
  }

  ticket.claimedBy = interaction.user.id;
  saveTickets(data);

  if (interaction.channel && interaction.channel.type === ChannelType.GuildText) {
    await interaction.channel.permissionOverwrites.create(interaction.user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0x3498db)
    .setDescription(`✅ **Ticket claimato da** ${interaction.user}`);

  await interaction.reply({ embeds: [embed] });
}

export async function handleReleaseTicket(interaction: ButtonInteraction) {
  const data = loadTickets();
  const ticket = findTicketByChannel(data.tickets, interaction.channelId!);
  if (!ticket) {
    await interaction.reply({ content: '❌ Ticket non trovato.', ephemeral: true });
    return;
  }

  if (!ticket.claimedBy) {
    await interaction.reply({ content: '❌ Nessuno ha claimato questo ticket.', ephemeral: true });
    return;
  }

  if (ticket.claimedBy !== interaction.user.id) {
    await interaction.reply({ content: '❌ Solo chi ha claimato può rilasciarlo.', ephemeral: true });
    return;
  }

  ticket.claimedBy = null;
  saveTickets(data);

  if (interaction.channel && interaction.channel.type === ChannelType.GuildText) {
    const overwrite = interaction.channel.permissionOverwrites.cache.get(interaction.user.id);
    if (overwrite) {
      await overwrite.delete();
    }
  }

  const embed = new EmbedBuilder()
    .setColor(0x95a5a6)
    .setDescription(`🌼 **Ticket rilasciato da** ${interaction.user}`);

  await interaction.reply({ embeds: [embed] });
}

export async function handleCloseTicket(interaction: ButtonInteraction) {
  const data = loadTickets();
  const ticket = findTicketByChannel(data.tickets, interaction.channelId!);
  if (!ticket) {
    await interaction.reply({ content: '❌ Ticket non trovato.', ephemeral: true });
    return;
  }

  ticket.status = 'closed';
  ticket.closedAt = new Date().toISOString();
  ticket.closedBy = interaction.user.id;
  saveTickets(data);

  await interaction.reply({ content: '❌ Ticket chiuso. Canale eliminato tra 5 secondi...' });

  setTimeout(async () => {
    if (channel.permissionsFor(channel.guild.members.me!)?.has('ManageChannels')) {
      await interaction.channel.delete();
    }
  }, 5000);
}
