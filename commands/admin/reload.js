const { SlashCommandBuilder } = require('discord.js');


module.exports = {
data: new SlashCommandBuilder()
.setName('reload')
.setDescription('Lädt Commands neu'),


async execute(interaction, client) {
client.commands.clear();
require('../../handlers/commandHandler')(client);


await interaction.reply('🔁 Commands wurden neu geladen');
},
};