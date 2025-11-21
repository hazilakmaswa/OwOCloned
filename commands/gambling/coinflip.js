const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'coinflip',
    aliases: ['cf', 'flip'],
    description: 'Flip a coin to win fowoncy!',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);
        
        if (!args[0]) {
            return message.reply('❌ Please specify an amount to bet! Usage: `owo coinflip <amount> <heads/tails>` or `owo coinflip all h`');
        }
        
        let betAmount;
        if (args[0].toLowerCase() === 'all') {
            betAmount = user.fowoncy;
        } else {
            betAmount = parseInt(args[0]);
        }
        
        if (!betAmount || betAmount <= 0) {
            return message.reply('❌ Invalid bet amount!');
        }
        
        if (betAmount > user.fowoncy) {
            return message.reply(`❌ You don't have enough fowoncy! You have **${formatNumber(user.fowoncy)}** fowoncy.`);
        }
        
        if (!args[1]) {
            return message.reply('❌ Please choose heads (h) or tails (t)!');
        }
        
        const choice = args[1].toLowerCase();
        let playerChoice;
        
        if (choice === 'h' || choice === 'heads') {
            playerChoice = 'heads';
        } else if (choice === 't' || choice === 'tails') {
            playerChoice = 'tails';
        } else {
            return message.reply('❌ Invalid choice! Please choose heads (h) or tails (t)!');
        }
        
        // Flip coin
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const won = result === playerChoice;
        
        // Update user
        user.fowoncy -= betAmount;
        let profit = -betAmount;
        
        if (won) {
            const winAmount = betAmount * 2;
            user.fowoncy += winAmount;
            profit = betAmount;
        }
        
        // Update gambling stats
        user.gambling.totalBet += betAmount;
        if (won) {
            user.gambling.totalWon += betAmount * 2;
        }
        
        // Update quest
        if (user.quest.type === 'gamble' && !user.quest.completed) {
            user.quest.progress += betAmount;
            if (user.quest.progress >= user.quest.required) {
                user.quest.completed = true;
            }
        }
        
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor(won ? '#2ecc71' : '#e74c3c')
            .setTitle('🪙 Coinflip')
            .setDescription(`You chose **${playerChoice}**\nThe coin landed on **${result}**!\n\n${won ? '✅ You won!' : '❌ You lost!'}`)
            .addFields(
                { name: 'Bet', value: `💵 ${formatNumber(betAmount)}`, inline: true },
                { name: 'Result', value: profit > 0 ? `+${formatNumber(profit)}` : `${formatNumber(profit)}`, inline: true },
                { name: 'Balance', value: `💰 ${formatNumber(user.fowoncy)}`, inline: true }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
