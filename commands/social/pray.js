const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'pray',
    aliases: ['🙏'],
    description: 'Pray for another user',
    cooldown: 300, // 5 minutes
    async execute(message, args, client) {
        // Check if user mentioned someone
        if (message.mentions.users.size === 0) {
            return message.reply('❌ Please mention a user to pray for!');
        }
        
        const target = message.mentions.users.first();
        
        if (target.id === message.author.id) {
            return message.reply('❌ You cannot pray for yourself!');
        }
        
        if (target.bot) {
            return message.reply('❌ You cannot pray for bots!');
        }
        
        const user = await getUser(message.author.id, message.author.username);
        const targetUser = await getUser(target.id, target.username);
        
        // Random reward (50-200 fowoncy)
        const reward = Math.floor(Math.random() * 151) + 50;
        
        targetUser.fowoncy += reward;
        targetUser.social.prayers += 1;
        
        await targetUser.save();
        
        const messages = [
            `🙏 ${message.author} prayed for ${target}! They received **${formatNumber(reward)}** fowoncy!`,
            `✨ ${message.author}'s prayer blessed ${target} with **${formatNumber(reward)}** fowoncy!`,
            `🌟 The heavens smile upon ${target}! ${message.author}'s prayer granted them **${formatNumber(reward)}** fowoncy!`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const embed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setDescription(randomMessage)
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
