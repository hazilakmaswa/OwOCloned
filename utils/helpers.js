const User = require('../models/User');

// Get or create user
async function getUser(userId, username) {
    let user = await User.findOne({ userId });
    if (!user) {
        user = new User({
            userId,
            username
        });
        await user.save();
    }
    return user;
}

// Add XP to user
async function addXp(user, amount) {
    user.xp += amount;
    user.totalXp += amount;
    
    const xpNeeded = user.level * 100;
    if (user.xp >= xpNeeded) {
        user.level += 1;
        user.xp = 0;
        return { leveled: true, newLevel: user.level };
    }
    
    await user.save();
    return { leveled: false };
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Random int between min and max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate xp needed for next level
function xpNeeded(level) {
    return level * 100;
}

// Create cooldown
function setCooldown(cooldowns, userId, commandName, seconds) {
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Map());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = seconds * 1000;
    
    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownAmount);
}

// Check cooldown
function checkCooldown(cooldowns, userId, commandName) {
    if (!cooldowns.has(commandName)) return 0;
    
    const timestamps = cooldowns.get(commandName);
    if (timestamps.has(userId)) {
        return timestamps.get(userId);
    }
    return 0;
}

// Get rank color
function getRankColor(rank) {
    const colors = {
        common: '#95a5a6',
        uncommon: '#2ecc71',
        rare: '#3498db',
        epic: '#9b59b6',
        mythical: '#e91e63',
        legendary: '#f39c12',
        special: '#e74c3c'
    };
    return colors[rank] || '#95a5a6';
}

// Get rank emoji
function getRankEmoji(rank) {
    const emojis = {
        common: '⚪',
        uncommon: '🟢',
        rare: '🔵',
        epic: '🟣',
        mythical: '🌸',
        legendary: '🟡',
        special: '⭐'
    };
    return emojis[rank] || '⚪';
}

// Generate quest
function generateQuest() {
    const quests = [
        { type: 'hunt', required: 10, reward: 500, description: 'Hunt 10 animals' },
        { type: 'battle', required: 5, reward: 1000, description: 'Win 5 battles' },
        { type: 'gamble', required: 1000, reward: 800, description: 'Gamble 1000 cowoncy' },
        { type: 'send', required: 500, reward: 600, description: 'Send 500 cowoncy to someone' }
    ];
    
    return quests[Math.floor(Math.random() * quests.length)];
}

module.exports = {
    getUser,
    addXp,
    formatNumber,
    randomInt,
    xpNeeded,
    setCooldown,
    checkCooldown,
    getRankColor,
    getRankEmoji,
    generateQuest
};
