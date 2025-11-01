const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: 'Show all available commands',
    cooldown: 5,
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('🐺 OwO Bot Commands')
            .setDescription('Here are all the available commands! Use `owo <command>` to use them.')
            .addFields(
                {
                    name: '💰 Economy Commands',
                    value: '`daily` - Claim daily reward\n`cowoncy` - Check balance\n`give` - Give cowoncy to someone\n`quest` - View/claim daily quest'
                },
                {
                    name: '🐾 Animal Commands',
                    value: '`hunt` - Hunt for animals\n`zoo` - View your collection\n`sell` - Sell animals'
                },
                {
                    name: '🎰 Gambling Commands',
                    value: '`slots` - Play slot machine\n`coinflip` - Flip a coin\n`blackjack` - Play blackjack'
                },
                {
                    name: '⚔️ Battle Commands',
                    value: '`battle` - Fight another user'
                },
                {
                    name: '👥 Social Commands',
                    value: '`profile` - View your stats\n`pray` - Pray for someone\n`level` - Check your level'
                },
                {
                    name: '🎨 Fun Commands',
                    value: '`owo` - Owoify text\n`roll` - Roll a die\n`8ball` - Ask the magic 8ball'
                }
            )
            .setFooter({ text: 'Use owo help <command> for more info about a specific command' })
            .setTimestamp();
        
        if (args[0]) {
            const commandName = args[0].toLowerCase();
            const command = client.commands.get(commandName) ||
                           client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            
            if (command) {
                const commandEmbed = new EmbedBuilder()
                    .setColor('#3498db')
                    .setTitle(`📖 ${command.name}`)
                    .setDescription(command.description || 'No description available')
                    .addFields(
                        { name: 'Cooldown', value: `${command.cooldown || 0} seconds`, inline: true }
                    );
                
                if (command.aliases && command.aliases.length > 0) {
                    commandEmbed.addFields({ name: 'Aliases', value: command.aliases.join(', '), inline: true });
                }
                
                return message.reply({ embeds: [commandEmbed] });
            }
        }
        
        message.reply({ embeds: [embed] });
    },
};
