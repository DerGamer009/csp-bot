const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLog } = require('../../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Entfernt den Timeout eines Users')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User dessen Timeout entfernt wird').setRequired(true)
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

    if (!member.moderatable) {
      await interaction.reply({
        content: '❌ Ich kann den Timeout hier nicht entfernen (Rollen/Permissions).',
        ephemeral: true,
      });
      return;
    }

    await member.timeout(null, reason);

    await interaction.reply({
      content: `✅ Timeout entfernt: ${targetUser}. Grund: **${reason}**`,
      ephemeral: true,
    });

    const embed = baseEmbed({ title: '✅ Untimeout', color: 0x2ecc71 }).addFields(
      { name: 'User', value: `${targetUser} (**${targetUser.tag}**)`, inline: false },
      { name: 'Moderator', value: `${interaction.user} (**${interaction.user.tag}**)`, inline: false },
      { name: 'Grund', value: reason.slice(0, 1024), inline: false }
    );

    await sendLog(client, interaction.guildId, 'mod', { embeds: [embed] });
  },
};

