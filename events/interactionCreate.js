module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.warn(`❌ Command nicht gefunden: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);

      const payload = { content: '❌ Fehler beim Command', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload);
      } else {
        await interaction.reply(payload);
      }
    }
  },
};