const { baseEmbed, sendLogEmbed } = require('../utils/logger');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    const embed = baseEmbed('📤 Leave')
      .addFields(
        { name: 'User', value: `${member.user.tag} (\`${member.user.id}\`)`, inline: false },
        { name: 'Beigetreten', value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : '—', inline: false },
        { name: 'Mitglieder', value: String(member.guild.memberCount ?? '—'), inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }));

    await sendLogEmbed(client, process.env.LOG_JOINLEAVE_CHANNEL_ID, embed);
  },
};
