import {
  ActionRowBuilder,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import path from 'path';

const logoPath = path.join(__dirname, '../../assets/logo.png');
const gifPath = path.join(__dirname, '../../assets/ticket.gif');

export const data = new SlashCommandBuilder()
  .setName('setup_ticket')
  .setDescription('Invia il pannello ticket nel canale corrente')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.channel || !interaction.channel.isTextBased()) {
    await interaction.reply({ content: '\u274c Comando utilizzabile solo in canali testuali.', ephemeral: true });
    return;
  }

  const logo = new AttachmentBuilder(logoPath, { name: 'logo.png' });
  const gif = new AttachmentBuilder(gifPath, { name: 'ticket.gif' });

  const embed = new EmbedBuilder()
    .setTitle('\ud83c\udfab Puglia RP \u2014 Ticket System')
    .setColor(0xff0000)
    .setThumbnail('attachment://logo.png')
    .setDescription(
      `\ud83d\udc4b **Benvenuto nel nostro sistema ticket!**\n` +
      `Seleziona una categoria dal men\u00f9 qui sotto per ricevere assistenza.\n\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `\ud83c\udf96\ufe0f **Assistenza Gradi Alti**\nPer informazioni e proposte dirette alla Fondazione\n\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `\ud83d\udeab **Segnalazione Utente**\nSegnala un utente con prove\n\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `\ud83d\udc1b **Segnalazione Bug**\nSegnala bug nel server\n\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `\ud83d\udcbb **Assistenza Discord**\nAiuto con il server Discord\n\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `\ud83c\udfae **Assistenza Game**\nAiuto nella parte di gioco\n\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `\ud83e\udd1d **Richiesta Partnership**\nRichiedi una collaborazione\n\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `\ud83d\udcec Un membro dello staff ti risponder\u00e0 al pi\u00f9 presto`
    )
    .setImage('attachment://ticket.gif')
    .setFooter({ text: '\ud83d\udccb Sistema ticket PLRP' })
    .setTimestamp();

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select_ticket')
      .setPlaceholder('\ud83d\udcc2 Seleziona una categoria...')
      .addOptions([
        { label: '\ud83c\udf96\ufe0f Assistenza Gradi Alti', value: 'ticket_gradi', emoji: '\ud83c\udf96\ufe0f' },
        { label: '\ud83d\udeab Segnalazione Utente', value: 'ticket_segnalazione', emoji: '\ud83d\udeab' },
        { label: '\ud83d\udc1b Segnalazione Bug', value: 'ticket_bug', emoji: '\ud83d\udc1b' },
        { label: '\ud83d\udcbb Assistenza Discord', value: 'ticket_discord', emoji: '\ud83d\udcbb' },
        { label: '\ud83c\udfae Assistenza Game', value: 'ticket_game', emoji: '\ud83c\udfae' },
        { label: '\ud83e\udd1d Richiesta Partnership', value: 'ticket_partner', emoji: '\ud83e\udd1d' },
      ]),
  );

  await interaction.channel.send({ embeds: [embed], components: [row], files: [logo, gif] });
  await interaction.reply({ content: '\u2705 Pannello ticket inviato!', ephemeral: true });
}
