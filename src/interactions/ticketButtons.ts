import { ButtonInteraction, TextChannel } from 'discord.js';

export async function handleTicketDelete(interaction: ButtonInteraction) {
    // 1. Definiamo il canale in modo sicuro prendendolo dall'interazione
    const channel = interaction.channel;

    // 2. Controllo di sicurezza: verifichiamo che esista e che sia testuale
    if (channel && channel.isTextBased()) {
        // 3. Convertiamo (cast) il canale in TextChannel per poter usare .delete()
        const textChannel = channel as TextChannel;
        
        // 4. Verifichiamo se il bot ha i permessi prima di eliminare
        const me = interaction.guild?.members.me;
        if (me && textChannel.permissionsFor(me)?.has('ManageChannels')) {
            await textChannel.delete();
        } else {
            await interaction.reply({ content: "❌ Non ho i permessi per eliminare questo canale.", ephemeral: true });
        }
    } else {
        await interaction.reply({ content: "❌ Errore: canale non valido o non testuale.", ephemeral: true });
    }
}
