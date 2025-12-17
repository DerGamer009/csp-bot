const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLog } = require('../../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kickt einen User vom Server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User der gekickt werden soll').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund (optional)').setRequired(false)
    ),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
      return;
    }

    if (!member.kickable) {
      await interaction.reply({
        content: '❌ Ich kann diesen User nicht kicken (Rollen/Permissions).',
        ephemeral: true,
      });
      return;
    }

    await member.kick(reason);

    await interaction.reply({
      content: `✅ ${targetUser} wurde gekickt. Grund: **${reason}**`,
      ephemeral: true,
    });

    const embed = baseEmbed({ title: '🛡️ Kick', color: 0xe74c3c })
      .addFields(
        { name: 'User', value: `${targetUser} (**${targetUser.tag}**)`, inline: false },
        { name: 'Moderator', value: `${interaction.user} (**${interaction.user.tag}**)`, inline: false },
        { name: 'Grund', value: reason.slice(0, 1024), inline: false }
      );

    await sendLog(client, interaction.guildId, 'mod', { embeds: [embed] });
  },
};

