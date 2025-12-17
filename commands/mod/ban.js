const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLog } = require('../../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannt einen User vom Server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User der gebannt werden soll').setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName('delete_days')
        .setDescription('Löscht Nachrichten der letzten X Tage (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund (optional)').setRequired(false)
    ),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user', true);
    const deleteDays = interaction.options.getInteger('delete_days') ?? 0;
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';

    // Wenn Mitglied, prüfen wir bannable; sonst versuchen wir User-ID zu bannen.
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (member && !member.bannable) {
      await interaction.reply({
        content: '❌ Ich kann diesen User nicht bannen (Rollen/Permissions).',
        ephemeral: true,
      });
      return;
    }

    await interaction.guild.bans.create(targetUser.id, {
      deleteMessageSeconds: deleteDays * 24 * 60 * 60,
      reason,
    });

    await interaction.reply({
      content: `✅ ${targetUser} wurde gebannt. Grund: **${reason}**`,
      ephemeral: true,
    });

    const embed = baseEmbed({ title: '⛔ Ban', color: 0x8e44ad })
      .addFields(
        { name: 'User', value: `${targetUser} (**${targetUser.tag}**)`, inline: false },
        { name: 'Moderator', value: `${interaction.user} (**${interaction.user.tag}**)`, inline: false },
        { name: 'Delete Days', value: String(deleteDays), inline: true },
        { name: 'Grund', value: reason.slice(0, 1024), inline: false }
      );

    await sendLog(client, interaction.guildId, 'mod', { embeds: [embed] });
  },
};

