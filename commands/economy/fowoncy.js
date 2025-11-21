const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');
const emojis = require('../../config/emojis');

module.exports = {
    name: 'fowoncy',
    aliases: ['bal', 'balance', 'money'],
    description: 'Check your fowoncy balance',
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
            .setColor('#f1c40f')
            .setTitle(`${targetUser.username}'s Balance`)
            .setDescription(`**${formatNumber(user.fowoncy)}** fowoncy`)
            .setThumbnail(cashImage)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
