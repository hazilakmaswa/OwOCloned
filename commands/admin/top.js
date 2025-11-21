const { EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'top',
    aliases: ['leaderboard', 'lb'],
    description: 'View the top players',
    cooldown: 10,
    async execute(message, args, client) {
        const category = args[0] || 'fowoncy';
        
        let sortField;
        let title;
        let displayField;
        
        switch (category.toLowerCase()) {
            case 'money':
            case 'fowoncy':
            case 'bal':
                sortField = 'fowoncy';
                title = '💰 Top Richest Players';
                displayField = (user) => `💵 ${formatNumber(user.fowoncy)}`;
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
                return message.reply('❌ Invalid category! Choose from: `fowoncy`, `zoo`, `level`, `battle`');
        }
        
        try {
            const topUsers = await User.find().sort({ [sortField]: -1 }).limit(10);
            
            if (topUsers.length === 0) {
                return message.reply('❌ No users found in the leaderboard!');
            }
            
            // Helper function to truncate long names
            function truncateName(name, maxLength = 20) {
                if (name.length > maxLength) {
                    return name.substring(0, maxLength - 3) + '...';
                }
                return name;
            }

            // Helper function to pad username for alignment
            function padName(name, length = 20) {
                const truncated = truncateName(name, length);
                return truncated.padEnd(length, ' ');
            }

            // Get category label and values
            let categoryLabel;
            let values = [];

            switch (category.toLowerCase()) {
                case 'money':
                case 'fowoncy':
                case 'bal':
                    categoryLabel = 'Fowoncy';
                    values = topUsers.map(u => formatNumber(u.fowoncy));
                    break;
                case 'zoo':
                case 'score':
                    categoryLabel = 'Zoo Score';
                    values = topUsers.map(u => formatNumber(u.zooScore));
                    break;
                case 'level':
                case 'xp':
                    categoryLabel = 'Level (XP)';
                    values = topUsers.map(u => `${u.level} (${formatNumber(u.totalXp)})`);
                    break;
                case 'battle':
                case 'battles':
                    categoryLabel = 'Wins (Rating)';
                    values = topUsers.map(u => `${u.battle.wins} (${u.battle.rating})`);
                    break;
            }

            // Find max value width for consistent spacing
            const maxValueWidth = Math.max(...values.map(v => v.length), categoryLabel.length);

            let description = '```\n';
            description += `Rank Name                 ${categoryLabel}\n`;
            description += `${'─'.repeat(45)}\n`;

            for (let i = 0; i < topUsers.length; i++) {
                const user = topUsers[i];
                const rank = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${String(i + 1).padStart(2, ' ')}.`;
                const username = padName(user.username, 20);
                const value = values[i];

                // Add dynamic spacing so the label column starts at the same position
                const spacing = ' '.repeat(maxValueWidth - value.length);

                // Use single space after medals, no space after numbered ranks (they already have trailing dot)
                const separator = i < 3 ? '  ' : ' ';

                description += `${rank}${separator}${username} ${value}${spacing}\n`;
            }
            description += '```';
            
            const embed = new EmbedBuilder()
                .setColor('#f39c12')
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: 'Use fowo top <category> to view different leaderboards\nCategories: fowoncy, zoo, level, battle' })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Leaderboard error:', error);
            message.reply('❌ Error fetching leaderboard data!');
        }
    },
};
