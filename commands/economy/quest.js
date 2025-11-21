const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber, generateQuest } = require('../../utils/helpers');

module.exports = {
    name: 'quest',
    aliases: ['q'],
    description: 'View or claim your daily quest',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);
        
        // If no quest, generate one
        if (!user.quest.type) {
            const quest = generateQuest();
            user.quest = {
                type: quest.type,
                progress: 0,
                required: quest.required,
                reward: quest.reward,
                completed: false,
                description: quest.description
            };
            await user.save();
        }
        
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('📜 Daily Quest');
        
        if (user.quest.completed) {
            // Claim reward
            if (args[0] === 'claim') {
                user.fowoncy += user.quest.reward;
                const reward = user.quest.reward;
                user.quest = {
                    type: null,
                    progress: 0,
                    required: 0,
                    reward: 0,
                    completed: false
                };
                await user.save();
                
                embed.setColor('#2ecc71')
                    .setDescription(`✅ Quest completed! You received **${formatNumber(reward)}** fowoncy!`)
                    .addFields({ name: 'Balance', value: `💵 ${formatNumber(user.fowoncy)}` });
                
                return message.reply({ embeds: [embed] });
            }
            
            embed.setDescription(`✅ Quest completed! Use \`owo quest claim\` to claim your reward!`)
                .addFields(
                    { name: 'Quest', value: user.quest.description || 'Unknown quest' },
                    { name: 'Reward', value: `💰 ${formatNumber(user.quest.reward)} fowoncy` }
                );
        } else {
            const progress = Math.min(user.quest.progress, user.quest.required);
            const percentage = Math.floor((progress / user.quest.required) * 100);
            const progressBar = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));
            
            embed.setDescription(user.quest.description || 'Unknown quest')
                .addFields(
                    { name: 'Progress', value: `${progressBar} ${progress}/${user.quest.required}` },
                    { name: 'Reward', value: `💰 ${formatNumber(user.quest.reward)} fowoncy` }
                );
        }
        
        message.reply({ embeds: [embed] });
    },
};
