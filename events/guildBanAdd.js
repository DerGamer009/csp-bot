const { AuditLogEvent } = require('discord.js');
const { baseEmbed, sendLogEmbed } = require('../utils/logger');

module.exports = {
  name: 'guildBanAdd',
  async execute(ban, client) {
    const guild = ban.guild;
    const user = ban.user;

    let moderatorText = 'Unbekannt';
    let reasonText = ban.reason ?? '—';

    try {
      const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 });
      const entry = logs.entries.first();
      if (entry && entry.target?.id === user.id) {
        moderatorText = entry.executor ? `${entry.executor.tag} (\`${entry.executor.id}\`)` : moderatorText;
        reasonText = entry.reason ?? reasonText;
      }
    } catch {
      // Ignorieren, wenn Permission fehlt
    }

    const embed = baseEmbed('⛔ Ban (Event)')
      .addFields(
        { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: false },
        { name: 'Moderator', value: moderatorText, inline: false },
        { name: 'Grund', value: reasonText, inline: false }
      )
      .setThumbnail(user.displayAvatarURL({ size: 256 }));

    await sendLogEmbed(client, process.env.LOG_MOD_CHANNEL_ID, embed);
  },
};
