const { SlashCommandBuilder } = require('discord.js');

const JOKES = [
  'Warum können Geister so schlecht lügen? Weil man durch sie hindurchsieht.',
  'Ich kenne einen Witz über Papier… aber den lasse ich lieber.',
  'Was macht ein Keks unter einem Baum? Krümel.',
  'Warum gehen Taucher rückwärts ins Wasser? Wenn sie vorwärts gehen, fallen sie ins Boot.',
  'Wie nennt man einen Bumerang, der nicht zurückkommt? Stock.',
  'Was ist orange und läuft durch den Wald? Eine Wanderine.',
  'Treffen sich zwei Jäger. Beide tot.',
  'Ich habe versucht, einen Witz über Zeitreisen zu erzählen… aber den mochtest du nicht.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Erzählt einen random Witz'),

  async execute(interaction) {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
    await interaction.reply(`😂 ${joke}`);
  },
};

