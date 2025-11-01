const { EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'top',
    aliases: ['leaderboard', 'lb'],
    description: 'View the top players',
    cooldown: 10,
    async execute(message, args, client) {
        const category = args[0] || 'cowoncy';
        
        let sortField;
        let title;
        let displayField;
        
        switch (category.toLowerCase()) {
            case 'money':
            case 'cowoncy':
            case 'bal':
                sortField = 'cowoncy';
                title = '💰 Top Richest Players';
                displayField = (user) => `💵 ${formatNumber(user.cowoncy)}`;
                break;
            case 'zoo':
            case 'score':
                sortField = 'zooScore';
                title = '🏆 Top Zoo Scores';
                displayField = (user) => `🏆 ${formatNumber(user.zooScore)}`;
                break;
            case 'level':
            case 'xp':
                sortField = 'totalXp';
                title = '⭐ Top Levels';
                displayField = (user) => `⭐ Level ${user.level} (${formatNumber(user.totalXp)} XP)`;
                break;
            case 'battle':
            case 'battles':
                sortField = 'battle.wins';
                title = '⚔️ Top Battle Winners';
                displayField = (user) => `⚔️ ${user.battle.wins} wins (${user.battle.rating} rating)`;
                break;
            default:
                return message.reply('❌ Invalid category! Choose from: `cowoncy`, `zoo`, `level`, `battle`');
        }
        
        try {
            const topUsers = await User.find().sort({ [sortField]: -1 }).limit(10);
            
            if (topUsers.length === 0) {
                return message.reply('❌ No users found in the leaderboard!');
            }
            
            let description = '';
            for (let i = 0; i < topUsers.length; i++) {
                const user = topUsers[i];
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                description += `${medal} **${user.username}** - ${displayField(user)}\n`;
            }
            
            const embed = new EmbedBuilder()
                .setColor('#f39c12')
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: 'Use owo top <category> to view different leaderboards' })
                .setTimestamp();
            
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Leaderboard error:', error);
            message.reply('❌ Error fetching leaderboard data!');
        }
    },
};
