const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLogEmbed } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannt einen User vom Server')
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund').setRequired(false)
    )
    .addIntegerOption((opt) =>
      opt
        .setName('delete_days')
        .setDescription('Lösche Nachrichten der letzten X Tage (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Nicht in DMs verfügbar.', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('grund') ?? 'Kein Grund angegeben';
    const deleteDays = interaction.options.getInteger('delete_days') ?? 0;

    // Discord API erwartet Sekunden (max. 7 Tage)
    const deleteMessageSeconds = deleteDays * 24 * 60 * 60;

    await interaction.guild.members.ban(user.id, { reason, deleteMessageSeconds });
    await interaction.reply({ content: `✅ **${user.tag}** wurde gebannt.`, ephemeral: true });

    const embed = baseEmbed('⛔ Ban')
      .addFields(
        { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: false },
        { name: 'Moderator', value: `${interaction.user.tag} (\`${interaction.user.id}\`)`, inline: false },
        { name: 'Grund', value: reason, inline: false },
        { name: 'Delete Days', value: String(deleteDays), inline: true }
      );
    await sendLogEmbed(interaction.client, process.env.LOG_MOD_CHANNEL_ID, embed);
  },
};
