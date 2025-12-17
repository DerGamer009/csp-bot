const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Zeigt Infos über einen User')
    .addUserOption((opt) =>
      opt
        .setName('user')
        .setDescription('Optional: anderer User')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const member = interaction.guild ? await interaction.guild.members.fetch(user.id).catch(() => null) : null;

    const created = `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`;
    const joined = member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : '—';

    await interaction.reply(
      [
        `👤 **${user.tag}**`,
        `- ID: \`${user.id}\``,
        `- Erstellt: ${created}`,
        `- Beigetreten: ${joined}`,
      ].join('\n')
    );
  },
};
