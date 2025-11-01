// Animals organized by rarity
const animals = {
    common: [
        { name: 'dog', emoji: '🐶', worth: 5 },
        { name: 'cat', emoji: '🐱', worth: 5 },
        { name: 'mouse', emoji: '🐭', worth: 5 },
        { name: 'hamster', emoji: '🐹', worth: 5 },
        { name: 'rabbit', emoji: '🐰', worth: 6 },
        { name: 'fox', emoji: '🦊', worth: 6 },
        { name: 'bear', emoji: '🐻', worth: 7 },
        { name: 'panda', emoji: '🐼', worth: 7 },
        { name: 'koala', emoji: '🐨', worth: 7 },
        { name: 'pig', emoji: '🐷', worth: 5 },
        { name: 'frog', emoji: '🐸', worth: 6 },
        { name: 'duck', emoji: '🦆', worth: 5 }
    ],
    uncommon: [
        { name: 'deer', emoji: '🦌', worth: 15 },
        { name: 'cow', emoji: '🐮', worth: 12 },
        { name: 'horse', emoji: '🐴', worth: 15 },
        { name: 'monkey', emoji: '🐵', worth: 13 },
        { name: 'raccoon', emoji: '🦝', worth: 14 },
        { name: 'penguin', emoji: '🐧', worth: 16 },
        { name: 'owl', emoji: '🦉', worth: 15 },
        { name: 'turtle', emoji: '🐢', worth: 12 },
        { name: 'crab', emoji: '🦀', worth: 14 },
        { name: 'octopus', emoji: '🐙', worth: 16 }
    ],
    rare: [
        { name: 'whale', emoji: '🐋', worth: 50 },
        { name: 'dolphin', emoji: '🐬', worth: 45 },
        { name: 'elephant', emoji: '🐘', worth: 55 },
        { name: 'giraffe', emoji: '🦒', worth: 52 },
        { name: 'zebra', emoji: '🦓', worth: 50 },
        { name: 'lion', emoji: '🦁', worth: 60 },
        { name: 'tiger', emoji: '🐯', worth: 60 },
        { name: 'rhino', emoji: '🦏', worth: 58 },
        { name: 'hippo', emoji: '🦛', worth: 56 },
        { name: 'peacock', emoji: '🦚', worth: 54 }
    ],
    epic: [
        { name: 'dragon', emoji: '🐉', worth: 200 },
        { name: 'unicorn', emoji: '🦄', worth: 180 },
        { name: 't-rex', emoji: '🦖', worth: 220 },
        { name: 'phoenix', emoji: '🦅', worth: 210 },
        { name: 'griffin', emoji: '🦅', worth: 200 },
        { name: 'kraken', emoji: '🐙', worth: 190 }
    ],
    mythical: [
        { name: 'baby dragon', emoji: '🐲', worth: 500 },
        { name: 'celestial', emoji: '✨', worth: 600 },
        { name: 'void', emoji: '🌌', worth: 550 },
        { name: 'gem', emoji: '💎', worth: 700 }
    ],
    legendary: [
        { name: 'ancient dragon', emoji: '🐉', worth: 2000 },
        { name: 'cosmic beast', emoji: '🌟', worth: 2500 },
        { name: 'fabled', emoji: '👑', worth: 3000 }
    ],
    special: [
        { name: 'bot', emoji: '🤖', worth: 10000 },
        { name: 'patreon', emoji: '💝', worth: 15000 },
        { name: '1mil', emoji: '🎉', worth: 20000 }
    ]
};

// Rarity chances
const rarityChances = {
    common: 0.55,
    uncommon: 0.25,
    rare: 0.12,
    epic: 0.05,
    mythical: 0.02,
    legendary: 0.008,
    special: 0.002
};

// Get random animal
function getRandomAnimal() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [rarity, chance] of Object.entries(rarityChances)) {
        cumulative += chance;
        if (rand <= cumulative) {
            const animalList = animals[rarity];
            const animal = animalList[Math.floor(Math.random() * animalList.length)];
            return { ...animal, rank: rarity };
        }
    }
    
    // Fallback to common
    const animalList = animals.common;
    const animal = animalList[Math.floor(Math.random() * animalList.length)];
    return { ...animal, rank: 'common' };
}

// Get all animals flat
function getAllAnimals() {
    const all = [];
    for (const [rank, animalList] of Object.entries(animals)) {
        animalList.forEach(animal => {
            all.push({ ...animal, rank });
        });
    }
    return all;
}

module.exports = {
    animals,
    rarityChances,
    getRandomAnimal,
    getAllAnimals
};
