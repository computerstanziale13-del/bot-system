import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('setup_staff')
  .setDescription('Invia il pannello gestione servizio staff nel canale corrente')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  // 1. Validazione sicura del canale
  const channel = interaction.channel;
  
  if (!channel || !channel.isTextBased()) {
    await interaction.reply({ content: '❌ Comando utilizzabile solo in canali testuali.', ephemeral: true });
    return;
  }

  // 2. Definizione del canale come TextChannel esplicito per TypeScript
  const textChannel = channel as TextChannel;

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
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('end_staff')
      .setLabel('🔴 Finisci Servizio')
      .setStyle(ButtonStyle.Danger),
  );

  // 3. Uso di textChannel che ora è riconosciuto correttamente dal compilatore
  await textChannel.send({ embeds: [embed], components: [row] });
  await interaction.reply({ content: '✅ Pannello staff inviato!', ephemeral: true });
}
