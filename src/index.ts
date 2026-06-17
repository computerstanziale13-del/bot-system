import { Client, Collection, EmbedBuilder, Events, GatewayIntentBits, Interaction, TextChannel, VoiceState } from 'discord.js';
import fs from 'fs';
import path from 'path';
import http from 'http'; // 1. IMPORTANTE: serve per la porta su Render

// --- Server HTTP per Render ---
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server HTTP attivo sulla porta ${PORT}`));

import * as ssu from './commands/ssu';
import * as ssd from './commands/ssd';
import * as setup_ticket from './commands/setup_ticket';
import * as setup_staff from './commands/setup_staff';
import { handleTicketSelect } from './interactions/ticketSelect';
import { handleClaimTicket, handleReleaseTicket, handleCloseTicket } from './interactions/ticketButtons';

const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error('Mancano le variabili d\'ambiente: DISCORD_TOKEN');
    process.exit(1);
}

// Interfaccia corretta
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
    console.log(`✅ Bot pronto! Loggato come ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;
        try { await command.execute(interaction); }
        catch (error) { console.error(error); }
        return;
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'select_ticket') {
        await handleTicketSelect(interaction);
        return;
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'claim_ticket') await handleClaimTicket(interaction);
        if (interaction.customId === 'release_ticket') await handleReleaseTicket(interaction);
        if (interaction.customId === 'close_ticket') await handleCloseTicket(interaction);
    }
});

// Percorso corretto (root/data/...)
const LOG_PATH = path.join(process.cwd(), 'data', 'staff_log.json');
const STAFF_VOICE_CHANNELS = ['1502642046903517194', '1509205481351151837', '1509205530978160660'];
const STAFF_LOG_CHANNEL = '1514178959334441071';

function loadStaffLog() {
    if (!fs.existsSync(LOG_PATH)) return { sessions: [] };
    return JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
}

function saveStaffLog(data: object) {
    fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

client.on(Events.VoiceStateUpdate, async (oldState: VoiceState, newState: VoiceState) => {
    const userId = newState.member?.id;
    const userTag = newState.member?.user.tag;
    const logChannel = await client.channels.fetch(STAFF_LOG_CHANNEL).catch(() => null);

    if (!logChannel || !logChannel.isTextBased()) return;

    // Logica ingresso/uscita (semplificata per leggibilità)
    const isEntering = !oldState.channelId && newState.channelId && STAFF_VOICE_CHANNELS.includes(newState.channelId);
    const isExiting = oldState.channelId && (!newState.channelId || !STAFF_VOICE_CHANNELS.includes(newState.channelId));

    if (isEntering || isExiting) {
        const log = loadStaffLog();
        log.sessions.push({
            type: isEntering ? 'start' : 'end',
            userId, userTag,
            channelName: (newState.channel || oldState.channel)?.name,
            timestamp: new Date().toISOString(),
        });
        saveStaffLog(log);

        await (logChannel as TextChannel).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(isEntering ? 0x00ff00 : 0xff0000)
                    .setDescription(`${isEntering ? '✅' : '🔴'} **<@${userId}> ha ${isEntering ? 'iniziato' : 'terminato'} il servizio**`)
                    .setTimestamp(),
            ],
        });
    }
});

client.login(token);
