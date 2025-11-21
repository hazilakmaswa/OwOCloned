const { EmbedBuilder } = require('discord.js');
const { getUser } = require('../../utils/helpers');

module.exports = {
    name: 'hug',
    aliases: ['🤗'],
    description: 'Give someone a hug!',
    cooldown: 10,
    async execute(message, args, client) {
        if (message.mentions.users.size === 0) {
            return message.reply('❌ Please mention someone to hug!');
        }

        const target = message.mentions.users.first();

        if (target.id === message.author.id) {
            return message.reply('❌ You cannot hug yourself! But here\'s a virtual hug for you 🤗');
        }

        if (target.bot) {
            return message.reply('❌ Bots don\'t need hugs... or do they? 🤖');
        }

        const targetUser = await getUser(target.id, target.username);

        targetUser.social.hugs += 1;
        await targetUser.save();

        const messages = [
            `🤗 ${message.author} gave ${target} a warm hug!`,
            `🤗 ${target} received a big hug from ${message.author}!`,
            `🤗 ${message.author} hugged ${target} tightly!`,
            `🤗 ${target} got a wholesome hug from ${message.author}!`,
            `🤗 ${message.author} wrapped ${target} in a comforting hug!`,
            `🤗 ${target} feels loved after ${message.author}'s hug!`
        ];

        const hugGifs = [
            'https://media.tenor.com/KcRB_M-KP_kAAAAC/hug.gif',
            'https://media.tenor.com/UW8n2LRShMYAAAAC/milk-and-mocha-bear-couple.gif',
            'https://media.tenor.com/hlKEXakJCS8AAAAC/anime-hug.gif',
            'https://media.tenor.com/lDKdShqaLKMAAAAC/hug.gif',
            'https://media.tenor.com/yVTSD0M90XIAAAAC/hugs-hug.gif',
            'https://media.tenor.com/D5X2cNlk_b8AAAAC/anime-love.gif',
            'https://media.tenor.com/dZiHGPCsATQAAAAC/hug-anime.gif',
            'https://media.tenor.com/1S0xqpiMyjYAAAAC/bunny-hug.gif'
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const randomGif = hugGifs[Math.floor(Math.random() * hugGifs.length)];

        const embed = new EmbedBuilder()
            .setColor('#ff69b4')
            .setDescription(`${randomMessage}\n\n${target} now has **${targetUser.social.hugs}** hugs!`)
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
