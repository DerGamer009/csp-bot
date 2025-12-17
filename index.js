require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { initDB } = require('./database/sqlite');

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

(async () => {
  const token = process.env.TOKEN;
  if (!token) {
    console.error('❌ TOKEN fehlt in der .env (Discord Bot Token).');
    process.exitCode = 1;
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildModeration,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User],
  });


  client.commands = new Collection();
  initDB();

  require('./handlers/commandHandler')(client);
  require('./handlers/eventHandler')(client);
  // deploy ist optional (wenn CLIENT_ID/GUILD_ID fehlen, wird sauber übersprungen)
  void require('./handlers/deployHandler')(client).catch((err) => {
    console.error('❌ DeployHandler Fehler:', err);
  });


  try {
    await client.login(token);
  } catch (err) {
    console.error('❌ Login fehlgeschlagen:', err);
    process.exitCode = 1;
  }
})();