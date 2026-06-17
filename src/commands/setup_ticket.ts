import {
  ActionRowBuilder,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextChannel, // Importiamo TextChannel
} from 'discord.js';
import path from 'path';

const logoPath = path.join(process.cwd(), 'assets', 'logo.png');
const gifPath = path.join(process.cwd(), 'assets', 'ticket.gif');

export const data = new SlashCommandBuilder()
  .setName('setup_ticket')
  .setDescription('Invia il pannello ticket nel canale corrente')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  // 1. Validazione sicura
  const channel = interaction.channel;

  if (!channel || !channel.isTextBased()) {
    await interaction.reply({ content: '❌ Comando utilizzabile solo in canali testuali.', ephemeral: true });
    return;
  }

  // 2. Casting esplicito a TextChannel
  const textChannel = channel as TextChannel;

  const logo = new AttachmentBuilder(logoPath, { name: 'logo.png' });
  const gif = new AttachmentBuilder(gifPath, { name: 'ticket.gif' });

  const embed = new EmbedBuilder()
    .setTitle('🎫 Puglia RP — Ticket System')
    .setColor(0xff0000)
    .setThumbnail('attachment://logo.png')
    .setDescription(
      `👋 **Benvenuto nel nostro sistema ticket!**\n` +
      `Seleziona una categoria dal menù qui sotto per ricevere assistenza.\n\n` +
      `-------------------------------------------\n\n` +
      `🎖️ **Assistenza Gradi Alti**\nPer informazioni e proposte dirette alla Fondazione\n\n` +
      `🚫 **Segnalazione Utente**\nSegnala un utente con prove\n\n` +
      `🐛 **Segnalazione Bug**\nSegnala bug nel server\n\n` +
      `💻 **Assistenza Discord**\nAiuto con il server Discord\n\n` +
      `🎮 **Assistenza Game**\nAiuto nella parte di gioco\n\n` +
      `🤝 **Richiesta Partnership**\nRichiedi una collaborazione\n\n` +
      `📩 Un membro dello staff ti risponderà al più presto`
    )
    .setImage('attachment://ticket.gif')
    .setFooter({ text: '📋 Sistema ticket PLRP' })
    .setTimestamp();

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select_ticket')
      .setPlaceholder('📂 Seleziona una categoria...')
      .addOptions([
        { label: 'Assistenza Gradi Alti', value: 'ticket_gradi', emoji: '🎖️' },
        { label: 'Segnalazione Utente', value: 'ticket_segnalazione', emoji: '🚫' },
        { label: 'Segnalazione Bug', value: 'ticket_bug', emoji: '🐛' },
        { label: 'Assistenza Discord', value: 'ticket_discord', emoji: '💻' },
        { label: 'Assistenza Game', value: 'ticket_game', emoji: '🎮' },
        { label: 'Richiesta Partnership', value: 'ticket_partner', emoji: '🤝' },
      ]),
  );

  // 3. Invio tramite textChannel
  await textChannel.send({ embeds: [embed], components: [row], files: [logo, gif] });
  await interaction.reply({ content: '✅ Pannello ticket inviato!', ephemeral: true });
}
