require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { initDB } = require('./database/sqlite');


const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
],
});


client.commands = new Collection();
initDB();

require('./handlers/commandHandler')(client);
require('./handlers/eventHandler')(client);
require('./handlers/deployHandler')(client);


client.login(process.env.TOKEN);