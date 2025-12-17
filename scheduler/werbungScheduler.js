const { getState } = require('../database/sqlite');


let interval = null;


function startScheduler(client) {
  const channelId = process.env.WERBUNG_CHANNEL_ID;
  if (!channelId) {
    console.warn('⚠️ WERBUNG_CHANNEL_ID fehlt – Werbung-Scheduler wird nicht gestartet.');
    return;
  }

  if (interval) clearInterval(interval);


  interval = setInterval(async () => {
    try {
      const enabled = await getState();
      if (!enabled) return;


      const channel = await client.channels.fetch(channelId);
      if (!channel) return;


      await channel.send({
        content:
          '🚀 **CraftingStudioPro Minecraft Network**\n\n✨ CityBuild | Events | Eigene Plugins\n🛠 Entwickelt von CraftingStudioPro\n\n🌍 Jetzt joinen & mitbauen!\n\n🔗 Discord: https://discord.gg/UhWTHXP4Qn',
      });
    } catch (err) {
      console.error('❌ Werbung-Scheduler Fehler:', err);
    }
  }, 2 * 60 * 60 * 1000); // 2 Stunden
}


module.exports = { startScheduler };