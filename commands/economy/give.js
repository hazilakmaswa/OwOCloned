const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'give',
    aliases: ['send', 'pay'],
    description: 'Give fowoncy to another user',
    cooldown: 10,
    async execute(message, args, client) {
        // Check if user mentioned someone
        if (message.mentions.users.size === 0) {
            return message.reply('❌ Please mention a user to give fowoncy to!');
        }
        
        const recipient = message.mentions.users.first();
        
        if (recipient.id === message.author.id) {
            return message.reply('❌ You cannot give fowoncy to yourself!');
        }
        
        if (recipient.bot) {
            return message.reply('❌ You cannot give fowoncy to bots!');
        }
        
        const amount = parseInt(args[1]);
        
        if (!amount || amount <= 0) {
            return message.reply('❌ Please specify a valid amount to give!');
        }
        
        const sender = await getUser(message.author.id, message.author.username);
        
        if (sender.fowoncy < amount) {
            return message.reply(`❌ You don't have enough fowoncy! You have **${formatNumber(sender.fowoncy)}** fowoncy.`);
        }
        
        const recipientUser = await getUser(recipient.id, recipient.username);
        
        // Transfer money
        sender.fowoncy -= amount;
        recipientUser.fowoncy += amount;
        
        // Update quest progress
        if (sender.quest.type === 'send' && !sender.quest.completed) {
            sender.quest.progress += amount;
            if (sender.quest.progress >= sender.quest.required) {
                sender.quest.completed = true;
            }
        }
        
        await sender.save();
        await recipientUser.save();
        
        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('💸 Money Sent!')
            .setDescription(`${message.author} gave **${formatNumber(amount)}** fowoncy to ${recipient}!`)
            .addFields(
                { name: 'Your Balance', value: `💵 ${formatNumber(sender.fowoncy)}`, inline: true },
                { name: 'Their Balance', value: `💵 ${formatNumber(recipientUser.fowoncy)}`, inline: true }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
