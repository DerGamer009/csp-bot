const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Zeigt den Avatar eines Users')
    .addUserOption((opt) =>
      opt
        .setName('user')
        .setDescription('Optional: anderer User')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const url = user.displayAvatarURL({ size: 1024, extension: 'png' });
    await interaction.reply(`${user.tag}\n${url}`);
  },
};
