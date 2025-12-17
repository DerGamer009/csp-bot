const { SlashCommandBuilder } = require('discord.js');
const path = require('path');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Lädt Commands neu'),


  async execute(interaction, client) {
    client.commands.clear();

    // require-Cache leeren, damit Änderungen wirklich geladen werden
    for (const key of Object.keys(require.cache)) {
      if (key.includes(`${path.sep}commands${path.sep}`)) {
        delete require.cache[key];
      }
      if (key.includes(`${path.sep}handlers${path.sep}commandHandler`)) {
        delete require.cache[key];
      }
    }

    require('../../handlers/commandHandler')(client);
    await interaction.reply('🔁 Commands wurden neu geladen');
  },
};