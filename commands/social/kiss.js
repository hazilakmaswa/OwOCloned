const { EmbedBuilder } = require('discord.js');
const { getUser } = require('../../utils/helpers');

module.exports = {
    name: 'kiss',
    aliases: ['😘', '💋'],
    description: 'Give someone a kiss!',
    cooldown: 10,
    async execute(message, args, client) {
        if (message.mentions.users.size === 0) {
            return message.reply('❌ Please mention someone to kiss!');
        }

        const target = message.mentions.users.first();

        if (target.id === message.author.id) {
            return message.reply('❌ You cannot kiss yourself! That\'s just weird 😅');
        }

        if (target.bot) {
            return message.reply('❌ Bots don\'t kiss back! 🤖💔');
        }

        const targetUser = await getUser(target.id, target.username);

        targetUser.social.kisses += 1;
        await targetUser.save();

        const messages = [
            `😘 ${message.author} gave ${target} a sweet kiss!`,
            `💋 ${target} received a kiss from ${message.author}!`,
            `😘 ${message.author} kissed ${target} on the cheek!`,
            `💋 ${target} got kissed by ${message.author}! How romantic!`,
            `😘 ${message.author} blew a kiss to ${target}!`,
            `💋 ${target} received a lovely kiss from ${message.author}!`
        ];

        const kissGif = 'https://cdn.weeb.sh/images/SJ3dXCKtW.gif';

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        const embed = new EmbedBuilder()
            .setColor('#ff1493')
            .setDescription(`${randomMessage}\n\n${target} now has **${targetUser.social.kisses}** kisses!`)
            .setImage(kissGif)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
