const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'battle',
    aliases: ['b', 'fight'],
    description: 'Battle another user!',
    cooldown: 30,
    async execute(message, args, client) {
        const user1 = await getUser(message.author.id, message.author.username);
        
        // Check if user mentioned someone
        if (message.mentions.users.size === 0) {
            return message.reply('❌ Please mention a user to battle! Usage: `owo battle @user [bet]`');
        }
        
        const opponent = message.mentions.users.first();
        
        if (opponent.id === message.author.id) {
            return message.reply('❌ You cannot battle yourself!');
        }
        
        if (opponent.bot) {
            return message.reply('❌ You cannot battle bots!');
        }
        
        const user2 = await getUser(opponent.id, opponent.username);
        
        // Optional bet
        let betAmount = 0;
        if (args[1]) {
            betAmount = parseInt(args[1]);
            
            if (betAmount > 0) {
                if (user1.cowoncy < betAmount) {
                    return message.reply(`❌ You don't have enough cowoncy for that bet!`);
                }
                if (user2.cowoncy < betAmount) {
                    return message.reply(`❌ ${opponent.username} doesn't have enough cowoncy for that bet!`);
                }
            }
        }
        
        // Calculate battle power (based on zoo score, level, and rating)
        const power1 = user1.zooScore + (user1.level * 50) + (user1.battle.rating / 10);
        const power2 = user2.zooScore + (user2.level * 50) + (user2.battle.rating / 10);
        
        // Add some randomness
        const random1 = power1 * (0.8 + Math.random() * 0.4);
        const random2 = power2 * (0.8 + Math.random() * 0.4);
        
        const winner = random1 > random2 ? user1 : user2;
        const loser = winner === user1 ? user2 : user1;
        const winnerMention = winner === user1 ? message.author : opponent;
        const loserMention = winner === user1 ? opponent : message.author;
        
        // Update stats
        winner.battle.wins += 1;
        winner.battle.rating += 10;
        loser.battle.losses += 1;
        loser.battle.rating = Math.max(0, loser.battle.rating - 10);
        
        user1.stats.battleCount += 1;
        user2.stats.battleCount += 1;
        
        // Handle bet
        if (betAmount > 0) {
            loser.cowoncy -= betAmount;
            winner.cowoncy += betAmount;
        }
        
        // Update quest for winner
        if (winner.quest.type === 'battle' && !winner.quest.completed) {
            winner.quest.progress += 1;
            if (winner.quest.progress >= winner.quest.required) {
                winner.quest.completed = true;
            }
        }
        
        await user1.save();
        await user2.save();
        
        const embed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setTitle('⚔️ Battle Results')
            .setDescription(`${winnerMention} defeated ${loserMention}!`)
            .addFields(
                { name: `${message.author.username}`, value: `💪 Power: ${Math.floor(random1)}\n🏆 W/L: ${user1.battle.wins}/${user1.battle.losses}\n⭐ Rating: ${user1.battle.rating}`, inline: true },
                { name: `${opponent.username}`, value: `💪 Power: ${Math.floor(random2)}\n🏆 W/L: ${user2.battle.wins}/${user2.battle.losses}\n⭐ Rating: ${user2.battle.rating}`, inline: true }
            )
            .setTimestamp();
        
        if (betAmount > 0) {
            embed.addFields({ name: 'Prize', value: `💰 ${formatNumber(betAmount)} cowoncy` });
        }
        
        message.reply({ embeds: [embed] });
    },
};
