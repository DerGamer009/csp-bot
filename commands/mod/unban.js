const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLogEmbed } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Entbannt einen User (per User-ID)')
    .addStringOption((opt) =>
      opt
        .setName('userid')
        .setDescription('Discord User-ID')
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Nicht in DMs verfügbar.', ephemeral: true });
      return;
    }

    const userId = interaction.options.getString('userid', true).trim();
    const reason = interaction.options.getString('grund') ?? 'Kein Grund angegeben';

    await interaction.guild.members.unban(userId, reason);
    await interaction.reply({ content: `✅ User \`${userId}\` wurde entbannt.`, ephemeral: true });

    const embed = baseEmbed('✅ Unban')
      .addFields(
        { name: 'UserID', value: `\`${userId}\``, inline: false },
        { name: 'Moderator', value: `${interaction.user.tag} (\`${interaction.user.id}\`)`, inline: false },
        { name: 'Grund', value: reason, inline: false }
      );
    await sendLogEmbed(interaction.client, process.env.LOG_MOD_CHANNEL_ID, embed);
  },
};
