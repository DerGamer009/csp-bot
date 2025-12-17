const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addWarning } = require('../../database/sqlite');
const { baseEmbed, sendLog } = require('../../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Verwarnt einen User (in DB gespeichert)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User der verwarnt wird').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund').setRequired(true)
    ),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('grund', true);

    const warningId = await addWarning({
      guildId: interaction.guildId,
      userId: targetUser.id,
      modId: interaction.user.id,
      reason,
    });

    await interaction.reply({
      content: `✅ ${targetUser} wurde verwarnt. Warn-ID: **${warningId}**`,
      ephemeral: true,
    });

    const embed = baseEmbed({ title: '⚠️ Warn', color: 0xf1c40f }).addFields(
      { name: 'User', value: `${targetUser} (**${targetUser.tag}**)`, inline: false },
      { name: 'Moderator', value: `${interaction.user} (**${interaction.user.tag}**)`, inline: false },
      { name: 'Warn-ID', value: String(warningId), inline: true },
      { name: 'Grund', value: reason.slice(0, 1024), inline: false }
    );

    await sendLog(client, interaction.guildId, 'mod', { embeds: [embed] });
  },
};

