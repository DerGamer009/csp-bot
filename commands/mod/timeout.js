const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLogEmbed } = require('../../utils/logger');

const MAX_TIMEOUT_MINUTES = 28 * 24 * 60; // 28 Tage

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Time-out für einen User setzen')
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User').setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName('minuten')
        .setDescription('Dauer in Minuten (1 - 40320)')
        .setMinValue(1)
        .setMaxValue(MAX_TIMEOUT_MINUTES)
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Nicht in DMs verfügbar.', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('user', true);
    const minutes = interaction.options.getInteger('minuten', true);
    const reason = interaction.options.getString('grund') ?? 'Kein Grund angegeben';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      await interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
      return;
    }

    if (!member.moderatable) {
      await interaction.reply({ content: '❌ Ich kann diesen User nicht timeouten (Rollen/Permissions).', ephemeral: true });
      return;
    }

    const durationMs = minutes * 60 * 1000;
    await member.timeout(durationMs, reason);
    await interaction.reply({ content: `✅ **${user.tag}** hat einen Timeout für **${minutes}** Minuten.`, ephemeral: true });

    const embed = baseEmbed('⏳ Timeout')
      .addFields(
        { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: false },
        { name: 'Moderator', value: `${interaction.user.tag} (\`${interaction.user.id}\`)`, inline: false },
        { name: 'Dauer', value: `${minutes} Minuten`, inline: true },
        { name: 'Grund', value: reason, inline: false }
      );
    await sendLogEmbed(interaction.client, process.env.LOG_MOD_CHANNEL_ID, embed);
  },
};
