const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  const commands = [];
  const commandsPath = path.join(__dirname, '..', 'commands');

  for (const folder of fs.readdirSync(commandsPath)) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(folderPath, file));
      if (command.data) {
        commands.push(command.data.toJSON());
        console.log(`📦 Deploy vorbereitet: ${command.data.name}`);
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );

  console.log('✅ Slash Commands registriert');
};
