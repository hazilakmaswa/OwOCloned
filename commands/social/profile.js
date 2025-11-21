const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');
const emojis = require('../../config/emojis');

module.exports = {
    name: 'profile',
    aliases: ['p', 'me', 'stats'],
    description: 'View your profile',
    cooldown: 5,
    async execute(message, args, client) {
        let targetUser = message.author;
        
        // Check if user mentioned someone
        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first();
        }
        
        const user = await getUser(targetUser.id, targetUser.username);
        const cashEmoji = emojis.getCash();

        // Calculate total animals
        const totalAnimals = user.animals.reduce((sum, a) => sum + a.count, 0);

        // XP progress
        const xpNeeded = user.level * 100;
        const xpPercent = Math.floor((user.xp / xpNeeded) * 100);
        const progressBar = '█'.repeat(Math.floor(xpPercent / 10)) + '░'.repeat(10 - Math.floor(xpPercent / 10));

        const embed = new EmbedBuilder()
            .setColor('#9b59b6')
            .setTitle(`${targetUser.username}'s Profile`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: `${cashEmoji} Fowoncy`, value: formatNumber(user.fowoncy), inline: true },
                { name: '⭐ Level', value: `${user.level}`, inline: true },
                { name: '🏆 Zoo Score', value: formatNumber(user.zooScore), inline: true },
                { name: '📊 XP Progress', value: `${progressBar}\n${user.xp}/${xpNeeded} (${xpPercent}%)` },
                { name: '🐾 Animals', value: `Total: ${totalAnimals}\nUnique: ${user.animals.length}`, inline: true },
                { name: '⚔️ Battles', value: `Wins: ${user.battle.wins}\nLosses: ${user.battle.losses}\nRating: ${user.battle.rating}`, inline: true },
                { name: '🎰 Gambling', value: `Total Bet: ${formatNumber(user.gambling.totalBet)}\nTotal Won: ${formatNumber(user.gambling.totalWon)}`, inline: true }
            )
            .setFooter({ text: `Total XP: ${formatNumber(user.totalXp)} | Hunts: ${user.stats.huntCount}` })
            .setTimestamp();
        
        if (user.social.marriedTo) {
            embed.addFields({ name: '💕 Married To', value: `<@${user.social.marriedTo}>` });
        }
        
        message.reply({ embeds: [embed] });
    },
};
