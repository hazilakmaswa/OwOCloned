const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber, getRankEmoji } = require('../../utils/helpers');

module.exports = {
    name: 'zoo',
    aliases: ['z', 'collection'],
    description: 'View your animal collection',
    cooldown: 5,
    async execute(message, args, client) {
        let targetUser = message.author;
        
        // Check if user mentioned someone
        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first();
        }
        
        const user = await getUser(targetUser.id, targetUser.username);
        
        if (user.animals.length === 0) {
            return message.reply('❌ This zoo is empty! Use `owo hunt` to catch some animals!');
        }
        
        // Sort animals by rank and count
        const sortedAnimals = user.animals.sort((a, b) => b.count - a.count);
        
        // Group by rank
        const rankOrder = ['legendary', 'mythical', 'epic', 'rare', 'uncommon', 'common', 'special'];
        const grouped = {};
        
        for (const rank of rankOrder) {
            grouped[rank] = sortedAnimals.filter(a => a.rank === rank);
        }
        
        // Create display (limit to top animals)
        let description = `**Zoo Score:** 🏆 ${formatNumber(user.zooScore)}\n**Total Animals:** 🐾 ${user.animals.reduce((sum, a) => sum + a.count, 0)}\n\n`;
        
        for (const rank of rankOrder) {
            if (grouped[rank].length > 0) {
                description += `**${getRankEmoji(rank)} ${rank.toUpperCase()}**\n`;
                const displayAnimals = grouped[rank].slice(0, 5);
                
                for (const animal of displayAnimals) {
                    description += `${animal.emoji} ${animal.name} × ${animal.count}\n`;
                }
                
                if (grouped[rank].length > 5) {
                    description += `*...and ${grouped[rank].length - 5} more*\n`;
                }
                description += '\n';
            }
        }
        
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`🦁 ${targetUser.username}'s Zoo`)
            .setDescription(description)
            .setThumbnail(targetUser.displayAvatarURL())
            .setFooter({ text: `Use owo sell <animal> to sell animals` })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
