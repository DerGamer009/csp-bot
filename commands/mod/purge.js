const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLogEmbed } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Löscht die letzten Nachrichten in diesem Channel')
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
        .setDescription('Optional: nur von diesem User löschen')
        .setRequired(false)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply({ content: '❌ Nicht in DMs verfügbar.', ephemeral: true });
      return;
    }

    const amount = interaction.options.getInteger('anzahl', true);
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('grund') ?? 'Kein Grund angegeben';

    await interaction.deferReply({ ephemeral: true });

    const messages = await interaction.channel.messages.fetch({ limit: 100 }).catch(() => null);
    if (!messages) {
      await interaction.editReply('❌ Konnte Nachrichten nicht laden.');
      return;
    }

    let toDelete = messages;
    if (targetUser) {
      toDelete = messages.filter((m) => m.author?.id === targetUser.id);
    }

    // max amount
    toDelete = toDelete.first(amount);

    const deleted = await interaction.channel.bulkDelete(toDelete, true).catch(() => null);
    if (!deleted) {
      await interaction.editReply('❌ Konnte Nachrichten nicht löschen (älter als 14 Tage?).');
      return;
    }

    await interaction.editReply(`✅ **${deleted.size}** Nachrichten gelöscht.`);

    const embed = baseEmbed('🧹 Purge')
      .addFields(
        { name: 'Channel', value: `<#${interaction.channelId}>`, inline: false },
        { name: 'Moderator', value: `${interaction.user.tag} (\`${interaction.user.id}\`)`, inline: false },
        { name: 'User-Filter', value: targetUser ? `${targetUser.tag} (\`${targetUser.id}\`)` : '—', inline: false },
        { name: 'Anzahl', value: String(deleted.size), inline: true },
        { name: 'Grund', value: reason, inline: false }
      );
    await sendLogEmbed(interaction.client, process.env.LOG_MOD_CHANNEL_ID, embed);
  },
};
