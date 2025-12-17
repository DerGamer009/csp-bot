const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js');
const { setLogChannel, clearLogChannel, getLogChannels } = require('../../database/sqlite');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logchannel')
    .setDescription('Konfiguriert die Log-Channels')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sc) =>
      sc
        .setName('set')
        .setDescription('Setzt einen Log-Channel')
        .addStringOption((opt) =>
          opt
            .setName('typ')
            .setDescription('Welcher Log?')
            .setRequired(true)
            .addChoices(
              { name: 'Mod Logs', value: 'mod' },
              { name: 'User Logs', value: 'user' },
              { name: 'Join/Leave Logs', value: 'joinleave' },
              { name: 'Message Logs', value: 'message' }
            )
        )
        .addChannelOption((opt) =>
          opt
            .setName('channel')
            .setDescription('Channel für diesen Log-Typ')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        )
    )
    .addSubcommand((sc) =>
      sc
        .setName('clear')
        .setDescription('Entfernt einen Log-Channel')
        .addStringOption((opt) =>
          opt
            .setName('typ')
            .setDescription('Welcher Log?')
            .setRequired(true)
            .addChoices(
              { name: 'Mod Logs', value: 'mod' },
              { name: 'User Logs', value: 'user' },
              { name: 'Join/Leave Logs', value: 'joinleave' },
              { name: 'Message Logs', value: 'message' }
            )
        )
    )
    .addSubcommand((sc) => sc.setName('show').setDescription('Zeigt aktuelle Log-Settings')),

  async execute(interaction) {
    const guildId = interaction.guildId;
    if (!guildId) {
      await interaction.reply({ content: '❌ Nur auf einem Server nutzbar.', ephemeral: true });
      return;
    }

    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const typ = interaction.options.getString('typ', true);
      const channel = interaction.options.getChannel('channel', true);

      await setLogChannel(guildId, typ, channel.id);
      await interaction.reply({
        content: `✅ Log-Channel gesetzt: **${typ}** → ${channel}`,
        ephemeral: true,
      });
      return;
    }

    if (sub === 'clear') {
      const typ = interaction.options.getString('typ', true);
      await clearLogChannel(guildId, typ);
      await interaction.reply({
        content: `✅ Log-Channel entfernt: **${typ}**`,
        ephemeral: true,
      });
      return;
    }

    const row = await getLogChannels(guildId);
    const fmt = (id) => (id ? `<#${id}>` : '—');

    await interaction.reply({
      content:
        `**Aktuelle Logs:**\n` +
        `- **Mod Logs**: ${fmt(row.modlog_channel_id)}\n` +
        `- **User Logs**: ${fmt(row.userlog_channel_id)}\n` +
        `- **Join/Leave**: ${fmt(row.joinleave_channel_id)}\n` +
        `- **Message Logs**: ${fmt(row.messagelog_channel_id)}`,
      ephemeral: true,
    });
  },
};

