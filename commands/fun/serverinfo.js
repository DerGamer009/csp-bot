const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Zeigt Infos über diesen Server'),

  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Nicht in einem Server verfügbar.', ephemeral: true });
      return;
    }

    const g = interaction.guild;
    const created = `<t:${Math.floor(g.createdTimestamp / 1000)}:F>`;

    await interaction.reply(
      [
        `🏠 **${g.name}**`,
        `- ID: \`${g.id}\``,
        `- Owner: <@${g.ownerId}>`,
        `- Erstellt: ${created}`,
        `- Mitglieder (ca.): ${g.memberCount ?? '—'}`,
      ].join('\n')
    );
  },
};
