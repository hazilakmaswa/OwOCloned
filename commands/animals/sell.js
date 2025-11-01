const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');
const { getAllAnimals } = require('../../utils/animals');

module.exports = {
    name: 'sell',
    aliases: ['s'],
    description: 'Sell animals from your zoo',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);
        
        if (!args[0]) {
            return message.reply('❌ Please specify an animal to sell! Usage: `owo sell <animal> [amount]`');
        }
        
        const animalName = args[0].toLowerCase();
        const amount = args[1] === 'all' ? 'all' : parseInt(args[1]) || 1;
        
        // Special case: sell by rank
        const ranks = ['common', 'uncommon', 'rare', 'epic', 'mythical', 'legendary'];
        if (ranks.includes(animalName)) {
            const animalsToSell = user.animals.filter(a => a.rank === animalName);
            
            if (animalsToSell.length === 0) {
                return message.reply(`❌ You don't have any ${animalName} animals!`);
            }
            
            let totalValue = 0;
            let totalSold = 0;
            
            const allAnimals = getAllAnimals();
            for (const animal of animalsToSell) {
                const animalData = allAnimals.find(a => a.name === animal.name && a.rank === animal.rank);
                if (animalData) {
                    totalValue += animalData.worth * animal.count;
                    totalSold += animal.count;
                    animal.count = 0;
                }
            }
            
            user.animals = user.animals.filter(a => a.count > 0);
            user.cowoncy += totalValue;
            await user.save();
            
            const embed = new EmbedBuilder()
                .setColor('#f39c12')
                .setTitle('💰 Animals Sold!')
                .setDescription(`Sold all **${totalSold}** ${animalName} animals for **${formatNumber(totalValue)}** cowoncy!`)
                .addFields({ name: 'Balance', value: `💵 ${formatNumber(user.cowoncy)}` })
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        // Find animal
        const animal = user.animals.find(a => a.name.toLowerCase() === animalName);
        
        if (!animal) {
            return message.reply(`❌ You don't have any **${animalName}** in your zoo!`);
        }
        
        const sellAmount = amount === 'all' ? animal.count : Math.min(amount, animal.count);
        
        if (sellAmount <= 0) {
            return message.reply('❌ Invalid amount to sell!');
        }
        
        // Get animal worth
        const allAnimals = getAllAnimals();
        const animalData = allAnimals.find(a => a.name === animal.name && a.rank === animal.rank);
        
        if (!animalData) {
            return message.reply('❌ Animal data not found!');
        }
        
        const totalValue = animalData.worth * sellAmount;
        
        // Update user
        animal.count -= sellAmount;
        if (animal.count <= 0) {
            user.animals = user.animals.filter(a => a.name !== animal.name || a.rank !== animal.rank);
        }
        
        user.cowoncy += totalValue;
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor('#f39c12')
            .setTitle('💰 Animal Sold!')
            .setDescription(`Sold **${sellAmount}x** ${animal.emoji} **${animal.name}** for **${formatNumber(totalValue)}** cowoncy!`)
            .addFields(
                { name: 'Balance', value: `💵 ${formatNumber(user.cowoncy)}`, inline: true },
                { name: 'Remaining', value: `${animal.count || 0}`, inline: true }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
