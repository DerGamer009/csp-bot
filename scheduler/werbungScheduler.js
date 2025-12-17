const CHANNEL_ID = '1448016023071621150';
const { getState } = require('../database/sqlite');


let interval = null;


function startScheduler(client) {
if (interval) clearInterval(interval);


interval = setInterval(async () => {
const enabled = await getState();
if (!enabled) return;


const channel = await client.channels.fetch(CHANNEL_ID);
if (!channel) return;


channel.send({
content: '🚀 **CraftingStudioPro Minecraft Network**\n\n✨ CityBuild | Events | Eigene Plugins\n🛠 Entwickelt von CraftingStudioPro\n\n🌍 Jetzt joinen & mitbauen!\n\n🔗 Discord: https://discord.gg/UhWTHXP4Qn',
});
}, 2 * 60 * 60 * 1000); // 2 Stunden
}


module.exports = { startScheduler };