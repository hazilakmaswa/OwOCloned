const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');
const emojis = require('../../config/emojis');

module.exports = {
    name: 'slots',
    aliases: ['slot', 's'],
    description: 'Play the slot machine!',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);

        if (!args[0]) {
            return message.reply('❌ Please specify an amount to bet! Usage: `fowo slots <amount>` or `fowo s all`');
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

        const cashImageUrl = emojis.getCashImage();
        const slotSymbols = emojis.getSlotSymbols();
        const spinningUrl = emojis.slots.spinning.url;

        // Weighted random selection
        function getRandomSymbol() {
            const totalWeight = slotSymbols.reduce((sum, s) => sum + s.weight, 0);
            let random = Math.random() * totalWeight;

            for (const symbol of slotSymbols) {
                if (random < symbol.weight) {
                    return symbol;
                }
                random -= symbol.weight;
            }
            return slotSymbols[0];
        }

        // Determine final results for middle row (winning row)
        const finalMiddle1 = getRandomSymbol();
        const finalMiddle2 = getRandomSymbol();
        const finalMiddle3 = getRandomSymbol();

        // Generate random symbols for top and bottom rows
        const topRow = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        const bottomRow = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

        // Send message with image URLs using invisible markdown links
        const createSlotMessage = (grid, statusText) => {
            const hideUrl = (url) => `[⠀](${url})`;
            return `**\`___SLOTS___\`**
${hideUrl(grid.top[0])} ${hideUrl(grid.top[1])} ${hideUrl(grid.top[2])}
${hideUrl(grid.middle[0])} ${hideUrl(grid.middle[1])} ${hideUrl(grid.middle[2])}  ◀
${hideUrl(grid.bottom[0])} ${hideUrl(grid.bottom[1])} ${hideUrl(grid.bottom[2])}

${message.author.username} bet ${cashImageUrl} ${formatNumber(betAmount)}
${statusText}`;
        };

        // Initial spinning grid
        const spinningGrid = {
            top: [spinningUrl, spinningUrl, spinningUrl],
            middle: [spinningUrl, spinningUrl, spinningUrl],
            bottom: [spinningUrl, spinningUrl, spinningUrl]
        };

        const slotMessage = await message.channel.send(createSlotMessage(spinningGrid, '🎲 Spinning...'));

        // Animation
        const totalFrames = 12;
        const lockPoints = [4, 8, 12];

        const locked = [false, false, false];
        const lockOrder = [0, 1, 2].sort(() => Math.random() - 0.5);

        const displayGrid = {
            top: [spinningUrl, spinningUrl, spinningUrl],
            middle: [spinningUrl, spinningUrl, spinningUrl],
            bottom: [spinningUrl, spinningUrl, spinningUrl]
        };

        const finalGrid = {
            top: [topRow[0].url, topRow[1].url, topRow[2].url],
            middle: [finalMiddle1.url, finalMiddle2.url, finalMiddle3.url],
            bottom: [bottomRow[0].url, bottomRow[1].url, bottomRow[2].url]
        };

        for (let frame = 1; frame <= totalFrames; frame++) {
            await new Promise(resolve => setTimeout(resolve, 200));

            for (let i = 0; i < 3; i++) {
                if (frame === lockPoints[i] && !locked[lockOrder[i]]) {
                    locked[lockOrder[i]] = true;
                    const colIndex = lockOrder[i];
                    displayGrid.top[colIndex] = finalGrid.top[colIndex];
                    displayGrid.middle[colIndex] = finalGrid.middle[colIndex];
                    displayGrid.bottom[colIndex] = finalGrid.bottom[colIndex];
                }
            }

            await slotMessage.edit(createSlotMessage(
                displayGrid,
                frame < totalFrames ? '🎲 Spinning...' : '✨ Locked!'
            ));
        }

        // Ensure all positions are locked to final values
        displayGrid.top = [...finalGrid.top];
        displayGrid.middle = [...finalGrid.middle];
        displayGrid.bottom = [...finalGrid.bottom];

        await new Promise(resolve => setTimeout(resolve, 500));

        // Calculate results
        let multiplier = 0;
        let resultText = '';

        if (finalMiddle1.emoji === finalMiddle2.emoji && finalMiddle2.emoji === finalMiddle3.emoji) {
            multiplier = finalMiddle1.multiplier;
            const winAmount = betAmount * multiplier;
            const profit = winAmount - betAmount;
            resultText = `and won ${cashImageUrl} **${formatNumber(profit)}** fowoncy! (${multiplier}x)`;
        } else {
            resultText = 'and won nothing... :c';
        }

        const winAmount = betAmount * multiplier;
        const profit = winAmount - betAmount;

        user.fowoncy -= betAmount;
        if (multiplier > 0) {
            user.fowoncy += winAmount;
        }

        user.gambling.totalBet += betAmount;
        if (multiplier > 0) {
            user.gambling.totalWon += winAmount;
        }

        if (user.quest.type === 'gamble' && !user.quest.completed) {
            user.quest.progress += betAmount;
            if (user.quest.progress >= user.quest.required) {
                user.quest.completed = true;
            }
        }

        await user.save();

        await slotMessage.edit(createSlotMessage(finalGrid, resultText));
    },
};
