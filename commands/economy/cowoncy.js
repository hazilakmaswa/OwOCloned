const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'cowoncy',
    aliases: ['bal', 'balance', 'money'],
    description: 'Check your cowoncy balance',
    cooldown: 3,
    async execute(message, args, client) {
        let targetUser = message.author;
        
        // Check if user mentioned someone
        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first();
        }
        
        const user = await getUser(targetUser.id, targetUser.username);
        
        const embed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle(`💰 ${targetUser.username}'s Balance`)
            .setDescription(`**${formatNumber(user.cowoncy)}** cowoncy`)
            .setThumbnail(targetUser.displayAvatarURL())
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
