const { SlashCommandBuilder } = require('discord.js');

const ANSWERS = [
  'Ja.',
  'Nein.',
  'Vielleicht.',
  'Definitiv.',
  'Auf keinen Fall.',
  'Sieht gut aus.',
  'Eher nicht.',
  'Frag später nochmal.',
  'Ich bin mir unsicher.',
  '100%.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Magische 8-Ball Antwort')
    .addStringOption((opt) =>
      opt
        .setName('frage')
        .setDescription('Deine Frage')
        .setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('frage', true);
    const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    await interaction.reply(`🎱 **Frage:** ${question}\n**Antwort:** ${answer}`);
  },
};
