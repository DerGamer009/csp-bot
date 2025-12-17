const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setState } = require('../../database/sqlite');


module.exports = {
data: new SlashCommandBuilder()
.setName('werbung-start')
.setDescription('Startet die automatische Server-Werbung')
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


async execute(interaction) {
setState(1);
await interaction.reply('✅ Server-Werbung wurde **aktiviert**');
},
};