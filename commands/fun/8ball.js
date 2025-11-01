const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '8ball',
    aliases: ['eightball', '8b'],
    description: 'Ask the magic 8ball a question!',
    cooldown: 5,
    async execute(message, args, client) {
        if (args.length === 0) {
            return message.reply('❌ Please ask a question!');
        }
        
        const responses = [
            // Positive
            'Yes!', 'Definitely!', 'For sure!', 'Absolutely!', 'You bet!',
            'Most likely!', 'Looking good!', 'Without a doubt!', 'Yes, definitely!',
            'It is certain!', 'As I see it, yes!', 'Signs point to yes!',
            // Neutral
            'Maybe...', 'Ask again later...', 'Better not tell you now...',
            'Cannot predict now...', 'Concentrate and ask again...',
            'Reply hazy, try again...', 'Not sure...',
            // Negative
            'No!', 'Definitely not!', 'Don\'t count on it!', 'My sources say no!',
            'Outlook not so good...', 'Very doubtful...', 'Absolutely not!',
            'No way!', 'I don\'t think so...'
        ];
        
        const answer = responses[Math.floor(Math.random() * responses.length)];
        const question = args.join(' ');
        
        const embed = new EmbedBuilder()
            .setColor('#9b59b6')
            .setTitle('🎱 Magic 8-Ball')
            .addFields(
                { name: 'Question', value: question },
                { name: 'Answer', value: answer }
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
