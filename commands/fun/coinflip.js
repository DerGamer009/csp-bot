const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Wirft eine Münze'),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Kopf' : 'Zahl';
    await interaction.reply(`🪙 Ergebnis: **${result}**`);
  },
};

