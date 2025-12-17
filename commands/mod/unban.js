const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLog } = require('../../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Entbannt einen User (per User-ID)')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((opt) =>
      opt
        .setName('userid')
        .setDescription('User-ID die entbannt werden soll')
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund (optional)').setRequired(false)
    ),

  async execute(interaction, client) {
    const userId = interaction.options.getString('userid', true).trim();
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';

    await interaction.guild.bans.remove(userId, reason);

    await interaction.reply({
      content: `✅ User **${userId}** wurde entbannt. Grund: **${reason}**`,
      ephemeral: true,
    });

    const embed = baseEmbed({ title: '✅ Unban', color: 0x2ecc71 }).addFields(
      { name: 'User ID', value: userId, inline: true },
      { name: 'Moderator', value: `${interaction.user} (**${interaction.user.tag}**)`, inline: false },
      { name: 'Grund', value: reason.slice(0, 1024), inline: false }
    );

    await sendLog(client, interaction.guildId, 'mod', { embeds: [embed] });
  },
};

