const { baseEmbed, sendLog } = require('../utils/logging');

function diffRoles(oldMember, newMember) {
  const oldSet = new Set(oldMember.roles.cache.map((r) => r.id));
  const newSet = new Set(newMember.roles.cache.map((r) => r.id));

  const added = [];
  const removed = [];

  for (const id of newSet) if (!oldSet.has(id)) added.push(id);
  for (const id of oldSet) if (!newSet.has(id)) removed.push(id);

  return { added, removed };
}

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember, client) {
    const guildId = newMember.guild?.id;
    if (!guildId) return;

    const changes = [];

    if (oldMember.nickname !== newMember.nickname) {
      changes.push({
        name: 'Nickname',
        value: `Alt: ${oldMember.nickname || '—'}\nNeu: ${newMember.nickname || '—'}`,
      });
    }

    const { added, removed } = diffRoles(oldMember, newMember);
    if (added.length) {
      changes.push({
        name: 'Rollen hinzugefügt',
        value: added.map((id) => `<@&${id}>`).join(', ').slice(0, 1024),
      });
    }
    if (removed.length) {
      changes.push({
        name: 'Rollen entfernt',
        value: removed.map((id) => `<@&${id}>`).join(', ').slice(0, 1024),
      });
    }

    if (!changes.length) return;

    const embed = baseEmbed({ title: '🧾 User Update', color: 0x3498db })
      .setDescription(`${newMember.user} (**${newMember.user.tag}**)`)
      .addFields(changes.slice(0, 25))
      .setThumbnail(newMember.user.displayAvatarURL?.() || null);

    await sendLog(client, guildId, 'user', { embeds: [embed] });
  },
};

