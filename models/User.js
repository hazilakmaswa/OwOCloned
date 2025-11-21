const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    
    // Economy
    fowoncy: { type: Number, default: 100 },
    
    // Daily rewards
    daily: {
        claimed: { type: Boolean, default: false },
        streak: { type: Number, default: 0 },
        lastClaimed: { type: Date, default: null }
    },
    
    // Quest system
    quest: {
        type: { type: String, default: null },
        progress: { type: Number, default: 0 },
        required: { type: Number, default: 0 },
        reward: { type: Number, default: 0 },
        completed: { type: Boolean, default: false }
    },
    
    // Level system
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    totalXp: { type: Number, default: 0 },
    
    // Zoo/Animals
    animals: [{
        name: { type: String },
        rank: { type: String },
        emoji: { type: String },
        count: { type: Number, default: 0 },
        displayCount: { type: Number, default: 0 }
    }],
    
    zooScore: { type: Number, default: 0 },
    
    // Battle stats
    battle: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        rating: { type: Number, default: 1000 },
        team: { type: Array, default: [] },
        pets: { type: Array, default: [] }
    },
    
    // Inventory
    inventory: {
        weapons: [{
            id: { type: String },
            name: { type: String },
            damage: { type: Number },
            emoji: { type: String }
        }],
        lootboxes: { type: Number, default: 0 },
        weaponCrates: { type: Number, default: 0 },
        gems: { type: Number, default: 0 },
        huntingRifle: { type: Boolean, default: false }
    },
    
    // Gambling stats
    gambling: {
        totalBet: { type: Number, default: 0 },
        totalWon: { type: Number, default: 0 },
        lotteryTickets: { type: Number, default: 0 }
    },
    
    // Social
    social: {
        marriedTo: { type: String, default: null },
        cookies: { type: Number, default: 0 },
        prayers: { type: Number, default: 0 },
        hugs: { type: Number, default: 0 },
        kisses: { type: Number, default: 0 }
    },
    
    // Settings
    settings: {
        autohunt: { type: Boolean, default: false },
        autohuntBudget: { type: Number, default: 0 }
    },
    
    // Statistics
    stats: {
        huntCount: { type: Number, default: 0 },
        battleCount: { type: Number, default: 0 },
        gambleCount: { type: Number, default: 0 },
        lastHunt: { type: Date, default: null },
        lastBattle: { type: Date, default: null },
        luck: { type: Number, default: 0 }
    },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
