const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber, getRankColor, getRankEmoji } = require('../../utils/helpers');
const { getRandomAnimal } = require('../../utils/animals');

module.exports = {
    name: 'hunt',
    aliases: ['h', 'catch'],
    description: 'Hunt for animals!',
    cooldown: 10,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);
        
        // Get random animals (3-5 animals per hunt)
        const animalCount = Math.floor(Math.random() * 3) + 3;
        const caughtAnimals = [];
        
        for (let i = 0; i < animalCount; i++) {
            const animal = getRandomAnimal();
            caughtAnimals.push(animal);
            
            // Add to user's zoo
            const existingAnimal = user.animals.find(a => a.name === animal.name && a.rank === animal.rank);
            if (existingAnimal) {
                existingAnimal.count += 1;
                existingAnimal.displayCount += 1;
            } else {
                user.animals.push({
                    name: animal.name,
                    rank: animal.rank,
                    emoji: animal.emoji,
                    count: 1,
                    displayCount: 1
                });
            }
            
            // Add to zoo score
            user.zooScore += animal.worth;
        }
        
        // Update stats
        user.stats.huntCount += 1;
        user.stats.lastHunt = new Date();
        
        // Update quest progress
        if (user.quest.type === 'hunt' && !user.quest.completed) {
            user.quest.progress += 1;
            if (user.quest.progress >= user.quest.required) {
                user.quest.completed = true;
            }
        }
        
        await user.save();
        
        // Create embed
        const animalList = caughtAnimals.map(a => 
            `${getRankEmoji(a.rank)} ${a.emoji} **${a.name}** (${a.rank})`
        ).join('\n');
        
        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🏹 Hunting Results!')
            .setDescription(`You caught ${animalCount} animals!\n\n${animalList}`)
            .addFields(
                { name: 'Zoo Score', value: `🏆 ${formatNumber(user.zooScore)}`, inline: true },
                { name: 'Total Hunts', value: `🎯 ${user.stats.huntCount}`, inline: true }
            )
            .setFooter({ text: 'Use owo zoo to view your collection!' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
