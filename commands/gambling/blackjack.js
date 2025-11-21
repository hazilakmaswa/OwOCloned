const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'blackjack',
    aliases: ['bj'],
    description: 'Play blackjack!',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);

        if (!args[0]) {
            return message.reply('❌ Please specify an amount to bet! Usage: `fowo blackjack <amount>`');
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

        // Card deck with emojis
        const deck = [
            { value: 2, emoji: '2️⃣' }, { value: 3, emoji: '3️⃣' }, { value: 4, emoji: '4️⃣' },
            { value: 5, emoji: '5️⃣' }, { value: 6, emoji: '6️⃣' }, { value: 7, emoji: '7️⃣' },
            { value: 8, emoji: '8️⃣' }, { value: 9, emoji: '9️⃣' }, { value: 10, emoji: '🔟' },
            { value: 10, emoji: '🇯' }, { value: 10, emoji: '🇶' }, { value: 10, emoji: '🇰' },
            { value: 11, emoji: '🅰️' }
        ];

        function drawCard() {
            return deck[Math.floor(Math.random() * deck.length)];
        }

        function getTotal(cards) {
            let total = cards.reduce((sum, card) => sum + card.value, 0);
            let aces = cards.filter(c => c.value === 11).length;

            while (total > 21 && aces > 0) {
                total -= 10;
                aces--;
            }

            return total;
        }

        function formatCards(cards, hideFirst = false) {
            if (hideFirst) {
                return '🎴 ' + cards.slice(1).map(c => c.emoji).join(' ');
            }
            return cards.map(c => c.emoji).join(' ');
        }

        // Initial deal
        const playerCards = [drawCard(), drawCard()];
        const dealerCards = [drawCard(), drawCard()];

        let playerTotal = getTotal(playerCards);
        let dealerTotal = getTotal(dealerCards);

        // Check for immediate blackjack
        if (playerTotal === 21) {
            // Dealer reveals
            const result = dealerTotal === 21 ? '🤝 Push! Both blackjack!' : '🎉 BLACKJACK!';
            const multiplier = dealerTotal === 21 ? 1 : 2.5;

            const winAmount = Math.floor(betAmount * multiplier);
            const profit = winAmount - betAmount;

            user.fowoncy -= betAmount;
            user.fowoncy += winAmount;
            user.gambling.totalBet += betAmount;
            user.gambling.totalWon += winAmount;

            if (user.quest.type === 'gamble' && !user.quest.completed) {
                user.quest.progress += betAmount;
                if (user.quest.progress >= user.quest.required) user.quest.completed = true;
            }

            await user.save();

            const embed = new EmbedBuilder()
                .setColor('#f1c40f')
                .setTitle('🃏 Blackjack')
                .setDescription(`**Your Hand:** ${formatCards(playerCards)} = **${playerTotal}**\n**Dealer Hand:** ${formatCards(dealerCards)} = **${dealerTotal}**\n\n${result}`)
                .addFields(
                    { name: 'Bet', value: `💵 ${formatNumber(betAmount)}`, inline: true },
                    { name: 'Result', value: profit > 0 ? `+${formatNumber(profit)}` : '±0', inline: true },
                    { name: 'Balance', value: `💰 ${formatNumber(user.fowoncy)}`, inline: true }
                )
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        // Show initial hand with buttons
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('🃏 Blackjack')
            .setDescription(`**Your Hand:** ${formatCards(playerCards)} = **${playerTotal}**\n**Dealer Hand:** ${formatCards(dealerCards, true)} = **?**\n\nClick a button below to play!`)
            .addFields(
                { name: 'Bet', value: `💵 ${formatNumber(betAmount)}`, inline: true },
                { name: 'Balance', value: `💰 ${formatNumber(user.fowoncy)}`, inline: true }
            )
            .setFooter({ text: 'You have 30 seconds to decide' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('hit')
                    .setLabel('👊 Hit')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('stand')
                    .setLabel('✋ Stand')
                    .setStyle(ButtonStyle.Success)
            );

        const gameMessage = await message.reply({ embeds: [embed], components: [row] });

        // Wait for button interaction
        const filter = (i) => i.user.id === message.author.id;

        try {
            const interaction = await gameMessage.awaitMessageComponent({ filter, time: 30000 });

            if (interaction.customId === 'hit') {
                // Hit
                const newCard = drawCard();
                playerCards.push(newCard);
                playerTotal = getTotal(playerCards);

                if (playerTotal > 21) {
                    // Bust
                    user.fowoncy -= betAmount;
                    user.gambling.totalBet += betAmount;

                    if (user.quest.type === 'gamble' && !user.quest.completed) {
                        user.quest.progress += betAmount;
                        if (user.quest.progress >= user.quest.required) user.quest.completed = true;
                    }

                    await user.save();

                    const bustEmbed = new EmbedBuilder()
                        .setColor('#e74c3c')
                        .setTitle('🃏 Blackjack')
                        .setDescription(`**Your Hand:** ${formatCards(playerCards)} = **${playerTotal}**\n**Dealer Hand:** ${formatCards(dealerCards)} = **${dealerTotal}**\n\n❌ BUST! You lost!`)
                        .addFields(
                            { name: 'Bet', value: `💵 ${formatNumber(betAmount)}`, inline: true },
                            { name: 'Result', value: `-${formatNumber(betAmount)}`, inline: true },
                            { name: 'Balance', value: `💰 ${formatNumber(user.fowoncy)}`, inline: true }
                        )
                        .setTimestamp();

                    await interaction.update({ embeds: [bustEmbed], components: [] });
                    return;
                }
            }

            // Stand or after hit without bust - dealer plays
            while (dealerTotal < 17) {
                dealerCards.push(drawCard());
                dealerTotal = getTotal(dealerCards);
            }

            // Determine winner
            let result = '';
            let multiplier = 0;

            if (dealerTotal > 21) {
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

            user.fowoncy -= betAmount;
            if (multiplier > 0) user.fowoncy += winAmount;
            user.gambling.totalBet += betAmount;
            if (multiplier > 0) user.gambling.totalWon += winAmount;

            if (user.quest.type === 'gamble' && !user.quest.completed) {
                user.quest.progress += betAmount;
                if (user.quest.progress >= user.quest.required) user.quest.completed = true;
            }

            await user.save();

            const finalEmbed = new EmbedBuilder()
                .setColor(multiplier >= 1 ? '#2ecc71' : '#e74c3c')
                .setTitle('🃏 Blackjack')
                .setDescription(`**Your Hand:** ${formatCards(playerCards)} = **${playerTotal}**\n**Dealer Hand:** ${formatCards(dealerCards)} = **${dealerTotal}**\n\n${result}`)
                .addFields(
                    { name: 'Bet', value: `💵 ${formatNumber(betAmount)}`, inline: true },
                    { name: 'Result', value: profit > 0 ? `+${formatNumber(profit)}` : profit === 0 ? '±0' : `${formatNumber(profit)}`, inline: true },
                    { name: 'Balance', value: `💰 ${formatNumber(user.fowoncy)}`, inline: true }
                )
                .setTimestamp();

            await interaction.update({ embeds: [finalEmbed], components: [] });

        } catch (error) {
            // Timeout - auto stand
            while (dealerTotal < 17) {
                dealerCards.push(drawCard());
                dealerTotal = getTotal(dealerCards);
            }

            let result = '';
            let multiplier = 0;

            if (dealerTotal > 21) {
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

            user.fowoncy -= betAmount;
            if (multiplier > 0) user.fowoncy += winAmount;
            user.gambling.totalBet += betAmount;
            if (multiplier > 0) user.gambling.totalWon += winAmount;

            if (user.quest.type === 'gamble' && !user.quest.completed) {
                user.quest.progress += betAmount;
                if (user.quest.progress >= user.quest.required) user.quest.completed = true;
            }

            await user.save();

            const timeoutEmbed = new EmbedBuilder()
                .setColor(multiplier >= 1 ? '#2ecc71' : '#e74c3c')
                .setTitle('🃏 Blackjack')
                .setDescription(`**Your Hand:** ${formatCards(playerCards)} = **${playerTotal}**\n**Dealer Hand:** ${formatCards(dealerCards)} = **${dealerTotal}**\n\n⏰ Time's up! Auto-stand.\n${result}`)
                .addFields(
                    { name: 'Bet', value: `💵 ${formatNumber(betAmount)}`, inline: true },
                    { name: 'Result', value: profit > 0 ? `+${formatNumber(profit)}` : profit === 0 ? '±0' : `${formatNumber(profit)}`, inline: true },
                    { name: 'Balance', value: `💰 ${formatNumber(user.fowoncy)}`, inline: true }
                )
                .setTimestamp();

            await gameMessage.edit({ embeds: [timeoutEmbed], components: [] });
        }
    },
};
