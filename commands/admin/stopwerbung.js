const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setState } = require('../../database/sqlite');


module.exports = {
data: new SlashCommandBuilder()
.setName('werbung-stop')
.setDescription('Stoppt die automatische Server-Werbung')
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


async execute(interaction) {
setState(0);
await interaction.reply('⛔ Server-Werbung wurde **deaktiviert**');
},
};