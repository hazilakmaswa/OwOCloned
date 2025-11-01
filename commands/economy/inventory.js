const { EmbedBuilder } = require('discord.js');
const { getUser, formatNumber } = require('../../utils/helpers');

module.exports = {
    name: 'inventory',
    aliases: ['inv', 'items'],
    description: 'View your inventory',
    cooldown: 5,
    async execute(message, args, client) {
        let targetUser = message.author;
        
        // Check if user mentioned someone
        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first();
        }
        
        const user = await getUser(targetUser.id, targetUser.username);
        
        let description = '';
        
        // Items
        if (user.inventory.lootboxes > 0) {
            description += `📦 **Lootboxes:** ${user.inventory.lootboxes}\n`;
        }
        
        if (user.inventory.weaponCrates > 0) {
            description += `⚔️ **Weapon Crates:** ${user.inventory.weaponCrates}\n`;
        }
        
        if (user.inventory.gems > 0) {
            description += `💎 **Gems:** ${user.inventory.gems}\n`;
        }
        
        if (user.inventory.huntingRifle) {
            description += `🔫 **Hunting Rifle:** Owned\n`;
        }
        
        // Weapons
        if (user.inventory.weapons.length > 0) {
            description += `\n**Weapons (${user.inventory.weapons.length})**\n`;
            user.inventory.weapons.slice(0, 5).forEach((weapon, i) => {
                description += `${weapon.emoji} ${weapon.name} (${weapon.damage} DMG)\n`;
            });
            if (user.inventory.weapons.length > 5) {
                description += `*...and ${user.inventory.weapons.length - 5} more*\n`;
            }
        }
        
        if (!description) {
            description = '❌ Your inventory is empty!';
        }
        
        const embed = new EmbedBuilder()
            .setColor('#9b59b6')
            .setTitle(`🎒 ${targetUser.username}'s Inventory`)
            .setDescription(description)
            .setThumbnail(targetUser.displayAvatarURL())
            .setFooter({ text: 'Buy items from owo shop' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
