const { ActivityType } = require('discord.js');
const { startScheduler } = require('../scheduler/werbungScheduler');


module.exports = {
name: 'ready',
once: true,
execute(client) {
console.log(`✅ Bot online als ${client.user.tag}`);


client.user.setActivity('CraftingStudioPro Network', {
type: ActivityType.Playing,
});


startScheduler(client);
},
};