const { baseEmbed, sendLog } = require('../utils/logging');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    const guildId = member.guild?.id;
    if (!guildId) return;

    const user = member.user;
    const embed = baseEmbed({ title: '👋 Member verlassen', color: 0xe67e22 })
      .setDescription(`${user} (**${user.tag}**)`)
      .addFields({ name: 'User ID', value: user.id, inline: true })
      .setThumbnail(user.displayAvatarURL?.() || null);

    await sendLog(client, guildId, 'joinleave', { embeds: [embed] });
  },
};

