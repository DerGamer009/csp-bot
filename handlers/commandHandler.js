const fs = require('fs');
const path = require('path');


module.exports = (client) => {
const commandsPath = path.join(__dirname, '..', 'commands');
const commandFolders = fs.readdirSync(commandsPath);


for (const folder of commandFolders) {
const folderPath = path.join(commandsPath, folder);
if (!fs.statSync(folderPath).isDirectory()) continue;


const commandFiles = fs
.readdirSync(folderPath)
.filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
const command = require(path.join(folderPath, file));


if (!command.data || !command.execute) {
console.warn(`⚠️ Command ${file} ist ungültig`);
continue;
}


client.commands.set(command.data.name, command);
console.log(`✅ Command geladen: ${command.data.name}`);
}
}
};