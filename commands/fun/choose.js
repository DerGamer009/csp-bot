const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Wählt zufällig eine Option aus')
    .addStringOption((opt) =>
      opt
        .setName('optionen')
        .setDescription('Optionen getrennt mit | (z.B. Pizza | Burger | Döner)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const raw = interaction.options.getString('optionen', true);
    const options = raw
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 25);

    if (options.length < 2) {
      await interaction.reply({ content: '❌ Bitte mind. **2** Optionen angeben (mit `|` trennen).', ephemeral: true });
      return;
    }

    const pick = options[Math.floor(Math.random() * options.length)];
    await interaction.reply(`🧠 Ich wähle: **${pick}**`);
  },
};

