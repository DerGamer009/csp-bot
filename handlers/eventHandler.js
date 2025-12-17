const fs = require('fs');
const path = require('path');


module.exports = (client) => {
  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith('.js'));


  for (const file of eventFiles) {
    let event;
    try {
      event = require(path.join(eventsPath, file));
    } catch (err) {
      console.error(`❌ Event konnte nicht geladen werden: ${file}`, err);
      continue;
    }


    if (!event?.name || typeof event.execute !== 'function') {
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
};