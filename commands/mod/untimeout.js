const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed, sendLogEmbed } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Entfernt den Timeout eines Users')
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Grund').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Nicht in DMs verfügbar.', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('grund') ?? 'Kein Grund angegeben';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      await interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
      return;
    }

    if (!member.moderatable) {
      await interaction.reply({ content: '❌ Ich kann diesen User nicht moderieren (Rollen/Permissions).', ephemeral: true });
      return;
    }

    await member.timeout(null, reason);
    await interaction.reply({ content: `✅ Timeout von **${user.tag}** wurde entfernt.`, ephemeral: true });

    const embed = baseEmbed('✅ Untimeout')
      .addFields(
        { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: false },
        { name: 'Moderator', value: `${interaction.user.tag} (\`${interaction.user.id}\`)`, inline: false },
        { name: 'Grund', value: reason, inline: false }
      );
    await sendLogEmbed(interaction.client, process.env.LOG_MOD_CHANNEL_ID, embed);
  },
};
