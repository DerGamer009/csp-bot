const { baseEmbed, sendLog } = require('../utils/logging');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    const guildId = newMessage?.guild?.id;
    if (!guildId) return;

    const author = newMessage.author || oldMessage.author;
    if (author?.bot) return;

    if (oldMessage.partial) {
      try {
        await oldMessage.fetch();
      } catch {
        // ok
      }
    }
    if (newMessage.partial) {
      try {
        await newMessage.fetch();
      } catch {
        // ok
      }
    }

    const oldContent = oldMessage.content ?? '—';
    const newContent = newMessage.content ?? '—';
    if (oldContent === newContent) return;

    const embed = baseEmbed({ title: '✏️ Nachricht bearbeitet', color: 0xf1c40f })
      .addFields(
        { name: 'User', value: author ? `${author} (**${author.tag}**)` : 'Unbekannt', inline: false },
        { name: 'Channel', value: newMessage.channel ? `${newMessage.channel}` : 'Unbekannt', inline: true },
        { name: 'Message', value: newMessage.url || '—', inline: true },
        { name: 'Alt', value: String(oldContent).slice(0, 1024), inline: false },
        { name: 'Neu', value: String(newContent).slice(0, 1024), inline: false }
      );

    await sendLog(client, guildId, 'message', { embeds: [embed] });
  },
};

