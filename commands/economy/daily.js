const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'daily',
    aliases: ['d'],
    description: 'Claim your daily cowoncy reward!',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);
        
        // Check if already claimed
        if (user.daily.claimed) {
            const embed = new EmbedBuilder()
                .setColor('#e74c3c')
                .setDescription('❌ You already claimed your daily reward! Come back tomorrow!');
            return message.reply({ embeds: [embed] });
        }
        
        // Calculate reward
        const baseReward = 500;
        const streakBonus = user.daily.streak * 50;
        const totalReward = baseReward + Math.min(streakBonus, 1000); // Max 1000 bonus
        
        // Update user
        user.cowoncy += totalReward;
        user.daily.claimed = true;
        user.daily.streak += 1;
        user.daily.lastClaimed = new Date();
        
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('💰 Daily Reward Claimed!')
            .setDescription(`You received **${formatNumber(totalReward)}** cowoncy!`)
            .addFields(
                { name: 'Streak', value: `🔥 ${user.daily.streak} days`, inline: true },
                { name: 'Balance', value: `💵 ${formatNumber(user.cowoncy)} cowoncy`, inline: true }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
