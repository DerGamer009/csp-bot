const { baseEmbed, sendLogEmbed } = require('../utils/logger');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (!newMessage.guild) return;
    if (newMessage.author?.bot) return;

    if (oldMessage.partial) {
      await oldMessage.fetch().catch(() => null);
    }
    if (newMessage.partial) {
      await newMessage.fetch().catch(() => null);
    }

    const before = oldMessage.content ?? '';
    const after = newMessage.content ?? '';

    // Nur loggen wenn sich Text geändert hat
    if (before === after) return;

    const author = newMessage.author ?? oldMessage.author;

    const embed = baseEmbed('✏️ Message Edit')
      .addFields(
        { name: 'Channel', value: `<#${newMessage.channelId}>`, inline: false },
        { name: 'Autor', value: author ? `${author.tag} (\`${author.id}\`)` : 'Unbekannt', inline: false },
        { name: 'Message', value: `[Jump](${newMessage.url})`, inline: false },
        { name: 'Vorher', value: (before.length ? before : '[leer/unklar]').slice(0, 1024), inline: false },
        { name: 'Nachher', value: (after.length ? after : '[leer]').slice(0, 1024), inline: false }
      );

    await sendLogEmbed(client, process.env.LOG_USER_CHANNEL_ID, embed);
  },
};
