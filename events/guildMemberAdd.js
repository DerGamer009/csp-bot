const { baseEmbed, sendLogEmbed } = require('../utils/logger');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const embed = baseEmbed('📥 Join')
      .addFields(
        { name: 'User', value: `${member.user.tag} (\`${member.user.id}\`)`, inline: false },
        { name: 'Account erstellt', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: false },
        { name: 'Mitglieder', value: String(member.guild.memberCount ?? '—'), inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }));

    await sendLogEmbed(client, process.env.LOG_JOINLEAVE_CHANNEL_ID, embed);
  },
};
