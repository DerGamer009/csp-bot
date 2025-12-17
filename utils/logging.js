const { EmbedBuilder } = require('discord.js');
const { getLogChannels } = require('../database/sqlite');

async function resolveLogChannelId(guildId, type) {
  const row = await getLogChannels(guildId);
  if (type === 'mod') return row.modlog_channel_id;
  if (type === 'user') return row.userlog_channel_id;
  if (type === 'joinleave') return row.joinleave_channel_id;
  if (type === 'message') return row.messagelog_channel_id;
  return null;
}

async function sendLog(client, guildId, type, payload) {
  if (!guildId) return false;
  const channelId = await resolveLogChannelId(guildId, type);
  if (!channelId) return false;

  let channel;
  try {
    channel = await client.channels.fetch(channelId);
  } catch {
    return false;
  }
  if (!channel || !channel.isTextBased?.()) return false;

  try {
    await channel.send(payload);
    return true;
  } catch (err) {
    console.error('❌ Logging: Konnte nicht senden:', err);
    return false;
  }
}

function baseEmbed({ title, color, timestamp = true }) {
  const e = new EmbedBuilder().setTitle(title).setColor(color);
  if (timestamp) e.setTimestamp(new Date());
  return e;
}

module.exports = {
  sendLog,
  baseEmbed,
};

