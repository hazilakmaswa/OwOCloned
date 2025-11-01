const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'owo',
    aliases: ['owoify'],
    description: 'Transform text into owo speak!',
    cooldown: 3,
    async execute(message, args, client) {
        if (args.length === 0) {
            return message.reply('❌ Please provide some text to owoify!');
        }
        
        function owoify(text) {
            return text
                .replace(/r|l/g, 'w')
                .replace(/R|L/g, 'W')
                .replace(/n([aeiou])/g, 'ny$1')
                .replace(/N([aeiou])/g, 'Ny$1')
                .replace(/N([AEIOU])/g, 'Ny$1')
                .replace(/ove/g, 'uv')
                .replace(/!+/g, (match) => `! ${['OwO', 'UwU', '>w<', '^w^'][Math.floor(Math.random() * 4)]} `)
                .replace(/\?+/g, (match) => `? ${['OwO', 'UwU', '>w<', '^w^'][Math.floor(Math.random() * 4)]} `)
                .replace(/\.+/g, (match) => `. ${['OwO', 'UwU', '>w<', '^w^'][Math.floor(Math.random() * 4)]} `);
        }
        
        const originalText = args.join(' ');
        const owoifiedText = owoify(originalText);
        
        const embed = new EmbedBuilder()
            .setColor('#ff69b4')
            .setTitle('✨ OwOified Text!')
            .setDescription(owoifiedText)
            .setFooter({ text: 'OwO what\'s this?' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
