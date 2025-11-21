const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'uploademojis',
    description: 'Upload slot emojis to this server (Admin only)',
    async execute(message, args, client) {
        // Check if user has admin permissions
        if (!message.member.permissions.has('ManageEmojisAndStickers')) {
            return message.reply('❌ You need "Manage Emojis and Stickers" permission to use this command!');
        }

        const assetsPath = path.join(__dirname, '../../assets');

        const emojisToUpload = [
            { file: 'slot_spin.gif', name: 'slot_spin' },
            { file: 'eggplant.webp', name: 'eggplant' },
            { file: 'heart.webp', name: 'heart' },
            { file: 'cherry.webp', name: 'cherry' },
            { file: 'w.webp', name: 'w' },
            { file: 'cash.webp', name: 'slotcash' },
            { file: 'cowoncy.webp', name: 'cowoncy' }
        ];

        await message.reply('🔄 Starting emoji upload...');

        const uploadedEmojis = [];
        const errors = [];

        for (const emojiInfo of emojisToUpload) {
            try {
                const filePath = path.join(assetsPath, emojiInfo.file);

                if (!fs.existsSync(filePath)) {
                    errors.push(`❌ File not found: ${emojiInfo.file}`);
                    continue;
                }

                const emoji = await message.guild.emojis.create({
                    attachment: filePath,
                    name: emojiInfo.name
                });

                uploadedEmojis.push(`✅ ${emoji.toString()} - \`${emoji.identifier}\``);
            } catch (error) {
                errors.push(`❌ Failed to upload ${emojiInfo.name}: ${error.message}`);
            }
        }

        let response = '**Emoji Upload Results:**\n\n';

        if (uploadedEmojis.length > 0) {
            response += '**Uploaded Successfully:**\n' + uploadedEmojis.join('\n') + '\n\n';
        }

        if (errors.length > 0) {
            response += '**Errors:**\n' + errors.join('\n') + '\n\n';
        }

        response += '\n**Next Steps:**\n';
        response += '1. Copy the emoji identifiers above\n';
        response += '2. Update `/home/nevdread/dev/repo_clones/owo-clone/config/emojis.js` with these IDs\n';
        response += '3. Restart the bot with `docker-compose restart`';

        await message.reply(response);
    },
};
