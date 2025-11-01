const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

const shopItems = {
    lootbox: {
        name: 'Lootbox',
        price: 1000,
        emoji: '📦',
        description: 'Mystery box with random rewards'
    },
    huntingrifle: {
        name: 'Hunting Rifle',
        price: 5000,
        emoji: '🔫',
        description: 'Catch more animals while hunting'
    },
    weaponcrate: {
        name: 'Weapon Crate',
        price: 2000,
        emoji: '⚔️',
        description: 'Random weapon for battles'
    },
    gem: {
        name: 'Gem',
        price: 500,
        emoji: '💎',
        description: 'Valuable gem'
    }
};

module.exports = {
    name: 'shop',
    aliases: ['store'],
    description: 'View and buy items from the shop',
    cooldown: 5,
    async execute(message, args, client) {
        const user = await getUser(message.author.id, message.author.username);
        
        // Show shop if no item specified
        if (!args[0]) {
            let description = `**Your Balance:** 💰 ${formatNumber(user.cowoncy)} cowoncy\n\n`;
            
            for (const [key, item] of Object.entries(shopItems)) {
                description += `${item.emoji} **${item.name}** - ${formatNumber(item.price)} cowoncy\n${item.description}\n\n`;
            }
            
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle('🏪 Shop')
                .setDescription(description)
                .setFooter({ text: 'Use owo shop <item> to buy an item' })
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }
        
        // Buy item
        const itemName = args[0].toLowerCase();
        const item = shopItems[itemName];
        
        if (!item) {
            return message.reply('❌ Item not found! Use `owo shop` to see available items.');
        }
        
        if (user.cowoncy < item.price) {
            return message.reply(`❌ You don't have enough cowoncy! You need ${formatNumber(item.price)} but only have ${formatNumber(user.cowoncy)}.`);
        }
        
        // Handle specific items
        if (itemName === 'lootbox') {
            user.inventory.lootboxes += 1;
        } else if (itemName === 'huntingrifle') {
            if (user.inventory.huntingRifle) {
                return message.reply('❌ You already own a hunting rifle!');
            }
            user.inventory.huntingRifle = true;
        } else if (itemName === 'weaponcrate') {
            user.inventory.weaponCrates += 1;
        } else if (itemName === 'gem') {
            user.inventory.gems += 1;
        }
        
        user.cowoncy -= item.price;
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('✅ Purchase Successful!')
            .setDescription(`You bought ${item.emoji} **${item.name}** for ${formatNumber(item.price)} cowoncy!`)
            .addFields({ name: 'Balance', value: `💰 ${formatNumber(user.cowoncy)}` })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
