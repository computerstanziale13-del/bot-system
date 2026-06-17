import { Client, Collection, EmbedBuilder, Events, GatewayIntentBits, Interaction, TextChannel, VoiceState } from 'discord.js';
import fs from 'fs';
import path from 'path';
import * as ssu from './commands/ssu';
import * as ssd from './commands/ssd';
import * as setup_ticket from './commands/setup_ticket';
import * as setup_staff from './commands/setup_staff';
import { handleTicketSelect } from './interactions/ticketSelect';
import { handleClaimTicket, handleReleaseTicket, handleCloseTicket } from './interactions/ticketButtons';
import { handleStartStaff, handleEndStaff } from './interactions/staffButtons';

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Mancano le variabili d\'ambiente: DISCORD_TOKEN');
  process.exit(1);
}

interface Command {
  data: { name: string; toJSON(): object };
  execute: (interaction: any) => Promise<void>;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const commands = new Collection<string, Command>();

commands.set(ssu.data.name, ssu);
commands.set(ssd.data.name, ssd);
commands.set(setup_ticket.data.name, setup_ticket);
commands.set(setup_staff.data.name, setup_staff);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`\u2705 Bot pronto! Loggato come ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) {
      console.warn(`Comando sconosciuto: ${interaction.commandName}`);
      return;
    }
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Errore nel comando ${interaction.commandName}:`, error);
      const reply = { content: '\u274c Si \u00e8 verificato un errore.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
    return;
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'select_ticket') {
    await handleTicketSelect(interaction);
    return;
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'claim_ticket') {
      await handleClaimTicket(interaction);
      return;
    }
    if (interaction.customId === 'release_ticket') {
      await handleReleaseTicket(interaction);
      return;
    }
    if (interaction.customId === 'close_ticket') {
      await handleCloseTicket(interaction);
      return;
    }
  }
});

const STAFF_VOICE_CHANNELS = ['1502642046903517194', '1509205481351151837', '1509205530978160660'];
const STAFF_LOG_CHANNEL = '1514178959334441071';

function loadStaffLog() {
  const logPath = path.join(__dirname, '../data/staff_log.json');
  if (!fs.existsSync(logPath)) return { sessions: [] };
  return JSON.parse(fs.readFileSync(logPath, 'utf-8'));
}

function saveStaffLog(data: object) {
  const logPath = path.join(__dirname, '../data/staff_log.json');
  fs.writeFileSync(logPath, JSON.stringify(data, null, 2), 'utf-8');
}

client.on(Events.VoiceStateUpdate, async (oldState: VoiceState, newState: VoiceState) => {
  const userId = newState.member?.id;
  const userTag = newState.member?.user.tag;
  const logChannel = await client.channels.fetch(STAFF_LOG_CHANNEL).catch(() => null);

  if (!logChannel || !logChannel.isTextBased()) return;

  // Entrato in un canale vocale staff
  if (!oldState.channelId && newState.channelId && STAFF_VOICE_CHANNELS.includes(newState.channelId)) {
    const log = loadStaffLog();
    log.sessions.push({
      type: 'start',
      userId,
      userTag,
      channelId: newState.channelId,
      channelName: newState.channel?.name,
      timestamp: new Date().toISOString(),
    });
    saveStaffLog(log);

    await (logChannel as TextChannel).send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ff00)
          .setDescription(`\u2705 **<@${userId}> ha iniziato il servizio** nel canale **${newState.channel?.name}**`)
          .setTimestamp(),
      ],
    });
    return;
  }

  // Uscito da un canale vocale staff
  if (oldState.channelId && !newState.channelId && STAFF_VOICE_CHANNELS.includes(oldState.channelId)) {
    const log = loadStaffLog();
    log.sessions.push({
      type: 'end',
      userId,
      userTag,
      channelId: oldState.channelId,
      channelName: oldState.channel?.name,
      timestamp: new Date().toISOString(),
    });
    saveStaffLog(log);

    await (logChannel as TextChannel).send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(`\ud83d\udd34 **<@${userId}> ha terminato il servizio** nel canale **${oldState.channel?.name}**`)
          .setTimestamp(),
      ],
    });
    return;
  }

  // Cambiato canale vocale: da staff \u2192 non staff
  if (oldState.channelId && newState.channelId && STAFF_VOICE_CHANNELS.includes(oldState.channelId) && !STAFF_VOICE_CHANNELS.includes(newState.channelId)) {
    const log = loadStaffLog();
    log.sessions.push({
      type: 'end',
      userId,
      userTag,
      channelId: oldState.channelId,
      channelName: oldState.channel?.name,
      timestamp: new Date().toISOString(),
    });
    saveStaffLog(log);

    await (logChannel as TextChannel).send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(`\ud83d\udd34 **<@${userId}> ha terminato il servizio** nel canale **${oldState.channel?.name}**`)
          .setTimestamp(),
      ],
    });
    return;
  }
});

client.login(token);
