const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hug',
    aliases: ['cuddle', 'snuggle'],
    description: 'Hug someone!',
    cooldown: 5,
    async execute(message, args, client) {
        if (message.mentions.users.size === 0) {
            return message.reply('❌ Please mention someone to hug!');
        }
        
        const target = message.mentions.users.first();
        
        const hugGifs = [
            'https://media.tenor.com/DpOf0xDiNrAAAAAC/anime-hug.gif',
            'https://media.tenor.com/B5gJITTWh8EAAAAC/anime-hug.gif',
            'https://media.tenor.com/D1T5bqDT6BQAAAAC/anime-hug.gif'
        ];
        
        const randomGif = hugGifs[Math.floor(Math.random() * hugGifs.length)];
        
        const embed = new EmbedBuilder()
            .setColor('#ff69b4')
            .setDescription(`${message.author} hugged ${target}! 🤗`)
            .setImage(randomGif)
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
