const { EmbedBuilder } = require('discord.js');
const { getUser } = require('../../utils/helpers');

module.exports = {
    name: 'cookie',
    aliases: ['🍪'],
    description: 'Give a cookie to someone!',
    cooldown: 60,
    async execute(message, args, client) {
        if (message.mentions.users.size === 0) {
            return message.reply('❌ Please mention someone to give a cookie to!');
        }
        
        const target = message.mentions.users.first();
        
        if (target.id === message.author.id) {
            return message.reply('❌ You cannot give yourself a cookie!');
        }
        
        if (target.bot) {
            return message.reply('❌ Bots don\'t need cookies!');
        }
        
        const targetUser = await getUser(target.id, target.username);
        
        targetUser.social.cookies += 1;
        await targetUser.save();
        
        const messages = [
            `🍪 ${message.author} gave ${target} a delicious cookie!`,
            `🍪 ${target} received a warm cookie from ${message.author}!`,
            `🍪 ${message.author} baked a cookie for ${target}!`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const embed = new EmbedBuilder()
            .setColor('#d2691e')
            .setDescription(`${randomMessage}\n\n${target} now has **${targetUser.social.cookies}** cookies!`)
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
