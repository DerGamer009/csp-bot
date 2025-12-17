const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getWarnings } = require('../../database/sqlite');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Zeigt Warnungen eines Users')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User dessen Warnungen angezeigt werden').setRequired(true)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user', true);

    const rows = await getWarnings({ guildId: interaction.guildId, userId: targetUser.id });
    if (!rows.length) {
      await interaction.reply({ content: `ℹ️ Keine Warnungen für ${targetUser}.`, ephemeral: true });
      return;
    }

    const lines = rows.slice(0, 15).map((w) => {
      const ts = Math.floor(w.created_at / 1000);
      return `- **#${w.id}** • <t:${ts}:R> • Mod: <@${w.mod_id}>\n  Grund: ${String(w.reason).slice(0, 200)}`;
    });

    await interaction.reply({
      content: `**Warnungen für ${targetUser} (Top ${Math.min(rows.length, 15)}):**\n${lines.join('\n')}`,
      ephemeral: true,
    });
  },
};

