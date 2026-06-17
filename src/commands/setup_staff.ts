import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('setup_staff')
  .setDescription('Invia il pannello gestione servizio staff nel canale corrente')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.channel || !interaction.channel.isTextBased()) {
    await interaction.reply({ content: '❌ Comando utilizzabile solo in canali testuali.', ephemeral: true });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('👮 Gestione Servizio Staff')
    .setColor(0xffaa00)
    .setDescription(
      `🟢 Clicca **Inizia Servizio** quando entri in servizio\n` +
      `🔴 Clicca **Finisci Servizio** quando esci dal servizio\n\n` +
      `⏰ Gli orari verranno registrati automaticamente nel log.`
    )
    .setFooter({ text: '📋 Sistema di tracciamento servizio PLRP' })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('start_staff')
      .setLabel('🟢 Inizia Servizio')
      .setStyle(ButtonStyle.Success)
      .setEmoji('🟢'),
    new ButtonBuilder()
      .setCustomId('end_staff')
      .setLabel('🔴 Finisci Servizio')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔴'),
  );

  await interaction.channel.send({ embeds: [embed], components: [row] });
  await interaction.reply({ content: '✅ Pannello staff inviato!', ephemeral: true });
}
