const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { parseDuration, formatMs } = require('../../utils/time');
const { baseEmbed, sendLog } = require('../../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Gibt einem User einen Timeout (Mute)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User der getimeoutet werden soll').setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName('dauer')
        .setDescription('z.B. 10m, 2h, 1d oder 1h30m (max. 28d)')
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund (optional)').setRequired(false)
    ),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user', true);
    const durationStr = interaction.options.getString('dauer', true);
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
      return;
    }

    const ms = parseDuration(durationStr);
    if (!ms) {
      await interaction.reply({
        content: '❌ Ungültige Dauer. Beispiel: `10m`, `2h`, `1d`, `1h30m`',
        ephemeral: true,
      });
      return;
    }

    const maxMs = 28 * 24 * 60 * 60 * 1000;
    if (ms > maxMs) {
      await interaction.reply({ content: '❌ Maximaler Timeout ist **28 Tage**.', ephemeral: true });
      return;
    }

    if (!member.moderatable) {
      await interaction.reply({
        content: '❌ Ich kann diesen User nicht timeouten (Rollen/Permissions).',
        ephemeral: true,
      });
      return;
    }

    await member.timeout(ms, reason);

    await interaction.reply({
      content: `✅ ${targetUser} hat einen Timeout: **${formatMs(ms)}**. Grund: **${reason}**`,
      ephemeral: true,
    });

    const embed = baseEmbed({ title: '⏳ Timeout', color: 0xf39c12 }).addFields(
      { name: 'User', value: `${targetUser} (**${targetUser.tag}**)`, inline: false },
      { name: 'Moderator', value: `${interaction.user} (**${interaction.user.tag}**)`, inline: false },
      { name: 'Dauer', value: formatMs(ms), inline: true },
      { name: 'Grund', value: reason.slice(0, 1024), inline: false }
    );

    await sendLog(client, interaction.guildId, 'mod', { embeds: [embed] });
  },
};

