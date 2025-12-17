const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  const token = process.env.TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!token || !clientId || !guildId) {
    console.warn(
      '⚠️ Deploy übersprungen (TOKEN/CLIENT_ID/GUILD_ID fehlt in .env).'
    );
    return;
  }

  const commands = [];
  const commandsPath = path.join(__dirname, '..', 'commands');

  for (const folder of fs.readdirSync(commandsPath)) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const command = require(path.join(folderPath, file));
        if (command?.data && typeof command.data.toJSON === 'function') {
          commands.push(command.data.toJSON());
          console.log(`📦 Deploy vorbereitet: ${command.data.name}`);
        } else {
          console.warn(`⚠️ Deploy: Command ${file} hat kein gültiges data-Objekt`);
        }
      } catch (err) {
        console.error(`❌ Deploy: Fehler beim Laden von ${file}:`, err);
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('✅ Slash Commands registriert');
  } catch (err) {
    console.error('❌ Slash Command Deploy fehlgeschlagen:', err);
  }
};
