const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Serving ${client.users.cache.size} users`);
        
        // Set bot status
        const activities = [
            { name: 'owo help', type: ActivityType.Listening },
            { name: 'with animals 🐾', type: ActivityType.Playing },
            { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching }
        ];
        
        let i = 0;
        setInterval(() => {
            client.user.setActivity(activities[i]);
            i = (i + 1) % activities.length;
        }, 15000);
    },
};
