const { baseEmbed, sendLog } = require('../utils/logging');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const guildId = member.guild?.id;
    if (!guildId) return;

    const embed = baseEmbed({ title: '✅ Member beigetreten', color: 0x2ecc71 })
      .setDescription(`${member.user} (**${member.user.tag}**)`)
      .addFields(
        { name: 'User ID', value: member.user.id, inline: true },
        { name: 'Account erstellt', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL?.() || null);

    await sendLog(client, guildId, 'joinleave', { embeds: [embed] });
  },
};

