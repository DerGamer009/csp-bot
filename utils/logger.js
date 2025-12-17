const { EmbedBuilder } = require('discord.js');

async function safeSend(channel, payload) {
  try {
    return await channel.send(payload);
  } catch (err) {
    console.error('❌ Logging: Konnte Nachricht nicht senden:', err);
    return null;
  }
}

async function getTextChannel(client, channelId) {
  if (!channelId) return null;
  try {
    return await client.channels.fetch(channelId);
  } catch {
    return null;
  }
}

/**
 * Sendet ein Log-Embed an einen Channel (falls konfiguriert).
 * @param {import('discord.js').Client} client
 * @param {string|undefined} channelId
 * @param {EmbedBuilder} embed
 */
async function sendLogEmbed(client, channelId, embed) {
  const channel = await getTextChannel(client, channelId);
  if (!channel) return null;
  return await safeSend(channel, { embeds: [embed] });
}

function baseEmbed(title) {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor(0x2b2d31)
    .setTimestamp();
}

module.exports = {
  sendLogEmbed,
  baseEmbed,
};
