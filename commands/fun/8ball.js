const { SlashCommandBuilder } = require('discord.js');

const ANSWERS = [
  'Ja.',
  'Nein.',
  'Vielleicht.',
  'Sieht gut aus.',
  'Eher nicht.',
  'Frag später nochmal.',
  'Ganz sicher.',
  'Auf keinen Fall.',
  'Die Zeichen stehen gut.',
  'Unklar.',
  'Definitiv.',
  'Nicht heute.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Stellt der Magic 8-Ball eine Frage')
    .addStringOption((opt) =>
      opt.setName('frage').setDescription('Deine Frage').setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('frage', true);
    const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    await interaction.reply(`🎱 **Frage:** ${question}\n**Antwort:** ${answer}`);
  },
};

