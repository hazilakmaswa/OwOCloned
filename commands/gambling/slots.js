const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'slots',
    aliases: ['slot', 's'],
    description: 'Play the slot machine!',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);
        
        if (!args[0]) {
            return message.reply('❌ Please specify an amount to bet! Usage: `owo slots <amount>` or `owo slots all`');
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
        
        const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '⭐', '7️⃣'];
        const weights = [30, 25, 20, 15, 10, 5, 3, 2];
        
        // Weighted random selection
        function getRandomSymbol() {
            const totalWeight = weights.reduce((sum, w) => sum + w, 0);
            let random = Math.random() * totalWeight;
            
            for (let i = 0; i < symbols.length; i++) {
                if (random < weights[i]) {
                    return symbols[i];
                }
                random -= weights[i];
            }
            return symbols[0];
        }
        
        const reel1 = getRandomSymbol();
        const reel2 = getRandomSymbol();
        const reel3 = getRandomSymbol();
        
        let multiplier = 0;
        let result = '';
        
        // Check for wins
        if (reel1 === reel2 && reel2 === reel3) {
            // All three match
            if (reel1 === '7️⃣') multiplier = 10;
            else if (reel1 === '⭐') multiplier = 8;
            else if (reel1 === '💎') multiplier = 6;
            else if (reel1 === '🔔') multiplier = 4;
            else multiplier = 3;
            
            result = '🎉 JACKPOT!';
        } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
            // Two match
            multiplier = 2;
            result = '✨ Two matched!';
        } else {
            result = '❌ No match';
        }
        
        const winAmount = betAmount * multiplier;
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
            .setColor(multiplier > 0 ? '#2ecc71' : '#e74c3c')
            .setTitle('🎰 Slot Machine')
            .setDescription(`\n${reel1} ${reel2} ${reel3}\n\n${result}`)
            .addFields(
                { name: 'Bet', value: `💵 ${formatNumber(betAmount)}`, inline: true },
                { name: 'Multiplier', value: `×${multiplier}`, inline: true },
                { name: 'Result', value: profit > 0 ? `+${formatNumber(profit)}` : `${formatNumber(profit)}`, inline: true },
                { name: 'Balance', value: `💰 ${formatNumber(user.cowoncy)}` }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
