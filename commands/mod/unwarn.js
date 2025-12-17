const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { removeWarning } = require('../../database/sqlite');
const { baseEmbed, sendLog } = require('../../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Entfernt eine Warnung per ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addIntegerOption((opt) =>
      opt.setName('id').setDescription('Warn-ID').setRequired(true).setMinValue(1)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund (optional)').setRequired(false)
    ),

  async execute(interaction, client) {
    const id = interaction.options.getInteger('id', true);
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';

    const changes = await removeWarning({ guildId: interaction.guildId, warningId: id });
    if (!changes) {
      await interaction.reply({ content: '❌ Warn-ID nicht gefunden.', ephemeral: true });
      return;
    }

    await interaction.reply({ content: `✅ Warnung **#${id}** wurde entfernt.`, ephemeral: true });

    const embed = baseEmbed({ title: '🧾 Unwarn', color: 0x3498db }).addFields(
      { name: 'Warn-ID', value: String(id), inline: true },
      { name: 'Moderator', value: `${interaction.user} (**${interaction.user.tag}**)`, inline: false },
      { name: 'Grund', value: reason.slice(0, 1024), inline: false }
    );

    await sendLog(client, interaction.guildId, 'mod', { embeds: [embed] });
  },
};

