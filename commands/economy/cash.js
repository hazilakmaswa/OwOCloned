const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');
const emojis = require('../../config/emojis');

module.exports = {
    name: 'cash',
    aliases: ['money', 'wallet'],
    description: 'Check your cash (fowoncy)',
    cooldown: 3,
    async execute(message, args, client) {
        let targetUser = message.author;

        // Check if user mentioned someone
        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first();
        }

        const user = await getUser(targetUser.id, targetUser.username);
        const cashEmoji = emojis.getCash();
        const cashImage = emojis.getCashImage();

        const embed = new EmbedBuilder()
            .setColor('#27ae60')
            .setTitle(`${targetUser.username}'s Cash`)
            .setDescription(`You have **${formatNumber(user.fowoncy)}** fowoncy`)
            .setThumbnail(cashImage)
            .setFooter({ text: `Use 'fowo daily' to claim your daily fowoncy!` })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
