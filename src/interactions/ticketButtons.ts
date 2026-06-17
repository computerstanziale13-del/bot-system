import { ButtonInteraction, TextChannel } from 'discord.js';

// Questa è la funzione che avevamo già corretto
export async function handleTicketDelete(interaction: ButtonInteraction) {
    const channel = interaction.channel;
    if (channel && channel.isTextBased()) {
        const textChannel = channel as TextChannel;
        await textChannel.delete();
    }
}

// AGGIUNGI QUESTE TRE FUNZIONI (esportate) per risolvere l'errore in index.ts
export async function handleClaimTicket(interaction: ButtonInteraction) {
    await interaction.reply({ content: "Ticket reclamato!", ephemeral: true });
}

export async function handleReleaseTicket(interaction: ButtonInteraction) {
    await interaction.reply({ content: "Ticket rilasciato!", ephemeral: true });
}

export async function handleCloseTicket(interaction: ButtonInteraction) {
    // Puoi richiamare la funzione di delete qui dentro se vuoi
    await handleTicketDelete(interaction);
}
