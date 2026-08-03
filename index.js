require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, Partials } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// === GLOBAL ERROR HANDLING ===
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// === CLIENT ===
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

// === COLLECTIONS ===
client.commands = new Collection();
client.cooldowns = new Collection();
client.battleSessions = new Collection();
client.activeLotteries = new Collection();

// === LOAD COMMANDS (dengan pengecekan folder) ===
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFolders = fs.readdirSync(commandsPath);
    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                try {
                    const command = require(path.join(folderPath, file));
                    if (command.name) {
                        client.commands.set(command.name, command);
                    } else {
                        console.warn(`⚠️ Command file ${file} tidak memiliki properti "name".`);
                    }
                } catch (err) {
                    console.error(`❌ Gagal memuat command ${file}:`, err);
                }
            }
        }
    }
} else {
    console.warn('⚠️ Folder "commands" tidak ditemukan, lewati pemuatan command.');
}

// === LOAD EVENTS (dengan pengecekan folder) ===
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        try {
            const event = require(path.join(eventsPath, file));
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        } catch (err) {
            console.error(`❌ Gagal memuat event ${file}:`, err);
        }
    }
} else {
    console.warn('⚠️ Folder "events" tidak ditemukan, lewati pemuatan event.');
}

// === MONGODB CONNECTION ===
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/owobot')
.then(() => console.log('✅ Terhubung ke MongoDB'))
.catch(err => console.error('❌ Gagal koneksi MongoDB:', err));

// === DAILY RESET CRON JOB ===
cron.schedule('0 0 * * *', async () => {
    try {
        const User = require('./models/User');
        await User.updateMany({}, {
            $set: {
                'daily.claimed': false,
                'quest.completed': false
            }
        });
        console.log('🔄 Daily reset selesai');
    } catch (err) {
        console.error('❌ Gagal menjalankan daily reset:', err);
    }
});

// === EVENT READY (konfirmasi login sukses) ===
client.once(Events.ClientReady, () => {
    console.log(`✅ Bot berhasil login sebagai ${client.user.tag}`);
});

// === LOGIN ===
client.login(process.env.BOT_TOKEN).catch(err => {
    console.error('❌ Gagal login bot:', err);
    process.exit(1); // Keluar dengan kode error agar Railway restart
});
