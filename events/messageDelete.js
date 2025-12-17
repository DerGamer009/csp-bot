const { baseEmbed, sendLogEmbed } = require('../utils/logger');

module.exports = {
  name: 'messageDelete',
  async execute(message, client) {
    // Bots/DMs ignorieren
    if (!message.guild) return;
    if (message.author?.bot) return;

    // Bei Partial versuchen wir zu fetchen
    if (message.partial) {
      await message.fetch().catch(() => null);
    }

    const author = message.author;
    const content = message.content?.length ? message.content : '[kein Inhalt / nicht gecached]';

    const embed = baseEmbed('🗑️ Message Delete')
      .addFields(
        { name: 'Channel', value: `<#${message.channelId}>`, inline: false },
        { name: 'Autor', value: author ? `${author.tag} (\`${author.id}\`)` : 'Unbekannt', inline: false },
        { name: 'Message ID', value: `\`${message.id}\``, inline: false },
        { name: 'Inhalt', value: content.slice(0, 1024), inline: false }
      );

    await sendLogEmbed(client, process.env.LOG_USER_CHANNEL_ID, embed);
  },
};
