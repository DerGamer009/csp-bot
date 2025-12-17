const fs = require('fs');
const path = require('path');


module.exports = (client) => {
const eventsPath = path.join(__dirname, '..', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));


for (const file of eventFiles) {
const event = require(path.join(eventsPath, file));


if (!event.name || !event.execute) {
console.warn(`⚠️ Event ${file} ist ungültig`);
continue;
}


if (event.once) {
client.once(event.name, (...args) => event.execute(...args, client));
} else {
client.on(event.name, (...args) => event.execute(...args, client));
}


console.log(`📡 Event geladen: ${event.name}`);
}
}