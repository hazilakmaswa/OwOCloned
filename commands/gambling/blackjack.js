const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'blackjack',
    aliases: ['bj'],
    description: 'Play blackjack!',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);
        
        if (!args[0]) {
            return message.reply('❌ Please specify an amount to bet! Usage: `owo blackjack <amount>`');
        }
        
        let betAmount;
        if (args[0].toLowerCase() === 'all') {
            betAmount = user.cowoncy;
        } else {
            betAmount = parseInt(args[0]);
        }
        
        if (!betAmount || betAmount <= 0) {
            return message.reply('❌ Invalid bet amount!');
        }
        
        if (betAmount > user.cowoncy) {
            return message.reply(`❌ You don't have enough cowoncy! You have **${formatNumber(user.cowoncy)}** cowoncy.`);
        }
        
        // Simplified blackjack - draw two cards each
        function getCard() {
            const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
            return cards[Math.floor(Math.random() * cards.length)];
        }
        
        function getTotal(cards) {
            let total = cards.reduce((sum, card) => sum + card, 0);
            let aces = cards.filter(c => c === 11).length;
            
            while (total > 21 && aces > 0) {
                total -= 10;
                aces--;
            }
            
            return total;
        }
        
        const playerCards = [getCard(), getCard()];
        const dealerCards = [getCard(), getCard()];
        
        const playerTotal = getTotal(playerCards);
        const dealerTotal = getTotal(dealerCards);
        
        let result = '';
        let multiplier = 0;
        
        if (playerTotal === 21 && dealerTotal !== 21) {
            result = '🎉 BLACKJACK!';
            multiplier = 2.5;
        } else if (playerTotal > 21) {
            result = '❌ BUST! You lost!';
            multiplier = 0;
        } else if (dealerTotal > 21) {
            result = '✅ Dealer BUST! You won!';
            multiplier = 2;
        } else if (playerTotal > dealerTotal) {
            result = '✅ You won!';
            multiplier = 2;
        } else if (playerTotal === dealerTotal) {
            result = '🤝 Push! Bet returned.';
            multiplier = 1;
        } else {
            result = '❌ Dealer wins!';
            multiplier = 0;
        }
        
        const winAmount = Math.floor(betAmount * multiplier);
        const profit = winAmount - betAmount;
        
        // Update user
        user.cowoncy -= betAmount;
        if (multiplier > 0) {
            user.cowoncy += winAmount;
        }
        
        // Update gambling stats
        user.gambling.totalBet += betAmount;
        if (multiplier > 0) {
            user.gambling.totalWon += winAmount;
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
            .setColor(multiplier >= 1 ? '#2ecc71' : '#e74c3c')
            .setTitle('🃏 Blackjack')
            .setDescription(`**Your Hand:** ${playerCards.join(' + ')} = **${playerTotal}**\n**Dealer Hand:** ${dealerCards.join(' + ')} = **${dealerTotal}**\n\n${result}`)
            .addFields(
                { name: 'Bet', value: `💵 ${formatNumber(betAmount)}`, inline: true },
                { name: 'Result', value: profit > 0 ? `+${formatNumber(profit)}` : profit === 0 ? '±0' : `${formatNumber(profit)}`, inline: true },
                { name: 'Balance', value: `💰 ${formatNumber(user.cowoncy)}`, inline: true }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
