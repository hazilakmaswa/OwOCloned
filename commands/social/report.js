const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'report',
    aliases: ['rep'],
    description: 'Report a user',
    cooldown: 30,
    async execute(message, args, client) {
        if (message.mentions.users.size === 0) {
            return message.reply('❌ Please mention someone to report!');
        }

        const target = message.mentions.users.first();

        if (target.id === message.author.id) {
            return message.reply('❌ You cannot report yourself!');
        }

        if (target.bot) {
            return message.reply('❌ You cannot report bots!');
        }

        const embed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setTitle('🚨 User Report')
            .setDescription(`**Tushar Singh** has reported ${target} to be a sussy!\n\n*If you are under 14 girl he will take back his words*`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
