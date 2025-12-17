const { baseEmbed, sendLog } = require('../utils/logging');

module.exports = {
  name: 'messageDelete',
  async execute(message, client) {
    if (!message?.guild?.id) return;
    if (message.author?.bot) return;

    // Bei Partials versuchen wir, Inhalte nachzuladen
    if (message.partial) {
      try {
        await message.fetch();
      } catch {
        // ignorieren – wir loggen dann ohne Content
      }
    }

    const content = message.content?.length ? message.content : '—';
    const channel = message.channel;

    const embed = baseEmbed({ title: '🗑️ Nachricht gelöscht', color: 0xe74c3c })
      .addFields(
        { name: 'User', value: message.author ? `${message.author} (**${message.author.tag}**)` : 'Unbekannt', inline: false },
        { name: 'Channel', value: channel ? `${channel}` : 'Unbekannt', inline: true },
        { name: 'Message ID', value: message.id || '—', inline: true },
        { name: 'Inhalt', value: content.slice(0, 1024), inline: false }
      );

    await sendLog(client, message.guild.id, 'message', { embeds: [embed] });
  },
};

