const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Würfelt eine Zahl')
    .addIntegerOption((opt) =>
      opt
        .setName('seiten')
        .setDescription('Wie viele Seiten? (2-100)')
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false)
    ),

  async execute(interaction) {
    const sides = interaction.options.getInteger('seiten') ?? 6;
    const value = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`🎲 d${sides}: **${value}**`);
  },
};
