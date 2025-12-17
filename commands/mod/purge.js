const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLog } = require('../../utils/logging');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Löscht eine Anzahl an Nachrichten im Channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((opt) =>
      opt
        .setName('anzahl')
        .setDescription('Wie viele Nachrichten? (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((opt) =>
      opt
        .setName('user')
        .setDescription('Optional: Nur Nachrichten dieses Users löschen (sofern im Batch)')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger('anzahl', true);
    const user = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.channel;
    if (!channel || !channel.isTextBased?.()) {
      await interaction.editReply('❌ Ungültiger Channel.');
      return;
    }

    // bulkDelete kann keine Nachrichten älter als 14 Tage löschen
    const fetched = await channel.messages.fetch({ limit: amount });
    const toDelete = user ? fetched.filter((m) => m.author?.id === user.id) : fetched;
    const deleted = await channel.bulkDelete(toDelete, true);

    await interaction.editReply(`✅ Gelöscht: **${deleted.size}** Nachrichten.`);

    const embed = baseEmbed({ title: '🧹 Purge', color: 0x95a5a6 }).addFields(
      { name: 'Moderator', value: `${interaction.user} (**${interaction.user.tag}**)`, inline: false },
      { name: 'Channel', value: `${channel}`, inline: true },
      { name: 'Angefordert', value: String(amount), inline: true },
      { name: 'Gelöscht', value: String(deleted.size), inline: true },
      { name: 'Filter User', value: user ? `${user} (**${user.tag}**)` : '—', inline: false }
    );

    await sendLog(client, interaction.guildId, 'mod', { embeds: [embed] });
  },
};

