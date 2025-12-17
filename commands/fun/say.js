const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Lässt den Bot eine Nachricht posten')
    .addStringOption((opt) =>
      opt
        .setName('text')
        .setDescription('Was soll der Bot sagen?')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const text = interaction.options.getString('text', true);

    // Minimaler Schutz gegen @everyone/@here Ping-Spam
    const safeText = text.replace(/@everyone/g, '@\u200beveryone').replace(/@here/g, '@\u200bhere');

    await interaction.reply({ content: '✅ Gesendet.', ephemeral: true });
    await interaction.channel.send({ content: safeText, allowedMentions: { parse: [] } });
  },
};
