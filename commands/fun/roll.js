const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roll',
    aliases: ['dice', 'd20'],
    description: 'Roll a dice!',
    cooldown: 3,
    async execute(message, args, client) {
        let sides = 6;
        
        if (args[0]) {
            const parsed = parseInt(args[0]);
            if (parsed && parsed > 0 && parsed <= 1000) {
                sides = parsed;
            }
        }
        
        const result = Math.floor(Math.random() * sides) + 1;
        
        let emoji = '🎲';
        if (sides === 20) emoji = '🎲';
        if (sides === 100) emoji = '💯';
        
        const embed = new EmbedBuilder()
            .setColor('#e91e63')
            .setTitle(`${emoji} Dice Roll`)
            .setDescription(`**Rolling a d${sides}...**\n\n🎯 You rolled: **${result}**`)
            .setTimestamp();
        
        if (result === sides) {
            embed.setDescription(`**Rolling a d${sides}...**\n\n🎯 You rolled: **${result}**\n\n🎉 **CRITICAL HIT!**`);
        } else if (result === 1 && sides > 1) {
            embed.setDescription(`**Rolling a d${sides}...**\n\n🎯 You rolled: **${result}**\n\n💀 **CRITICAL FAIL!**`);
        }
        
        message.reply({ embeds: [embed] });
    },
};
