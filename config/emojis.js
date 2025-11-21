// Custom emoji configuration
// Discord custom emojis require server upload, so we use direct image URLs

module.exports = {
    // Cash/Fowoncy emoji - using direct CDN URL
    cash: '<:cowoncy:416043450337853441>',

    // Cash emoji as image URL (can be used in embeds)
    cashImageUrl: 'https://cdn.discordapp.com/emojis/416043450337853441.webp?size=22',

    // Fallback to default emoji if custom emoji isn't available
    cashFallback: '💵',

    // Slot machine emojis with image URLs
    slots: {
        // Animated spinning emoji
        spinning: {
            url: 'https://cdn.discordapp.com/emojis/417473893368987649.webp?size=22&animated=true',
            emoji: '<a:slot_spin:417473893368987649>'
        },
        // Eggplant - 1x multiplier
        eggplant: {
            url: 'https://cdn.discordapp.com/emojis/417475705719226369.webp?size=22',
            emoji: '<:eggplant:417475705719226369>',
            multiplier: 1,
            weight: 40
        },
        // Heart - 2x multiplier
        heart: {
            url: 'https://cdn.discordapp.com/emojis/417475705899712522.webp?size=22',
            emoji: '<:heart:417475705899712522>',
            multiplier: 2,
            weight: 35
        },
        // Cherry - 5x multiplier
        cherry: {
            url: 'https://cdn.discordapp.com/emojis/417475705178161162.webp?size=22',
            emoji: '<:cherry:417475705178161162>',
            multiplier: 5,
            weight: 30
        },
        // W - 8x multiplier
        w: {
            url: 'https://cdn.discordapp.com/emojis/417475705920684053.webp?size=22',
            emoji: '<:w:417475705920684053>',
            multiplier: 8,
            weight: 20
        },
        // Cash - 10x multiplier
        slotCash: {
            url: 'https://cdn.discordapp.com/emojis/417475705912426496.webp?size=22',
            emoji: '<:slotcash:417475705912426496>',
            multiplier: 10,
            weight: 10
        }
    },

    // Helper function to get emoji or fallback (use image URL)
    getCash() {
        // Return the cash image URL for inline display
        return this.cashImageUrl;
    },

    // Get cash emoji image URL for thumbnails
    getCashImage() {
        return this.cashImageUrl;
    },

    // Get all slot symbols (excluding spinning)
    getSlotSymbols() {
        return [
            this.slots.eggplant,
            this.slots.heart,
            this.slots.cherry,
            this.slots.w,
            this.slots.slotCash
        ];
    }
};
