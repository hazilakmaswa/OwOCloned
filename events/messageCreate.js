const { Events } = require('discord.js');
const { getUser, addXp } = require('../utils/helpers');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        // Ignore bots
        if (message.author.bot) return;
        
        // Add XP for chatting (random 5-15 XP per message, with cooldown)
        if (!client.xpCooldowns) client.xpCooldowns = new Map();
        
        const userId = message.author.id;
        const now = Date.now();
        const cooldownAmount = 60000; // 1 minute
        
        if (!client.xpCooldowns.has(userId) || now - client.xpCooldowns.get(userId) > cooldownAmount) {
            try {
                const user = await getUser(userId, message.author.username);
                const xpGain = Math.floor(Math.random() * 11) + 5; // 5-15 XP
                const result = await addXp(user, xpGain);
                
                if (result.leveled) {
                    message.reply(`🎉 Level up! You're now level ${result.newLevel}!`).catch(() => {});
                }
                
                client.xpCooldowns.set(userId, now);
            } catch (error) {
                console.error('XP error:', error);
            }
        }
        
        // Check for command prefix
        const prefix = 'owo ';
        if (!message.content.toLowerCase().startsWith(prefix)) return;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = client.commands.get(commandName) ||
                       client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if (!command) return;
        
        // Check cooldowns
        if (command.cooldown) {
            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Map());
            }
            
            const now = Date.now();
            const timestamps = client.cooldowns.get(command.name);
            const cooldownAmount = command.cooldown * 1000;
            
            if (timestamps.has(userId)) {
                const expirationTime = timestamps.get(userId) + cooldownAmount;
                
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`⏰ Please wait ${timeLeft.toFixed(1)} seconds before using \`${command.name}\` again.`);
                }
            }
            
            timestamps.set(userId, now);
            setTimeout(() => timestamps.delete(userId), cooldownAmount);
        }
        
        // Execute command
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing ${command.name}:`, error);
            message.reply('❌ There was an error executing that command!').catch(() => {});
        }
    },
};
