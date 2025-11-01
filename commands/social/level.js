const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'level',
    aliases: ['lvl', 'rank'],
    description: 'Check your level and XP',
    cooldown: 5,
    async execute(message, args, client) {
        let targetUser = message.author;
        
        // Check if user mentioned someone
        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first();
        }
        
        const user = await getUser(targetUser.id, targetUser.username);
        
        const xpNeeded = user.level * 100;
        const xpPercent = Math.floor((user.xp / xpNeeded) * 100);
        const progressBar = '█'.repeat(Math.floor(xpPercent / 5)) + '░'.repeat(20 - Math.floor(xpPercent / 5));
        
        const embed = new EmbedBuilder()
            .setColor('#9b59b6')
            .setTitle(`⭐ ${targetUser.username}'s Level`)
            .setDescription(`**Level ${user.level}**\n\n${progressBar}\n${user.xp}/${xpNeeded} XP (${xpPercent}%)`)
            .addFields(
                { name: 'Total XP', value: formatNumber(user.totalXp), inline: true },
                { name: 'Next Level', value: `${xpNeeded - user.xp} XP`, inline: true }
            )
            .setThumbnail(targetUser.displayAvatarURL())
            .setFooter({ text: 'Gain XP by chatting in the server!' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
