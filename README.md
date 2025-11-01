# 🐺 OwO Discord Bot - Feature Complete Edition

A comprehensive Discord bot inspired by the popular OwO bot, featuring animal collection, economy system, battles, gambling, and social features!

## ✨ Features

### 💰 Economy System
- **Daily Rewards** - Claim daily cowoncy with streak bonuses
- **Quest System** - Complete daily quests for rewards
- **Trading** - Give/receive cowoncy between users
- **Balance Tracking** - Check your wealth

### 🐾 Animal Collection
- **Hunt Animals** - Catch 200+ animals with various rarities
- **Zoo Management** - Build and display your collection
- **Rarity System** - Common, Uncommon, Rare, Epic, Mythical, Legendary, Special
- **Selling** - Sell animals for cowoncy

### 🎰 Gambling
- **Slot Machine** - Spin for up to 10x multiplier
- **Coinflip** - Double or nothing
- **Blackjack** - Classic card game

### ⚔️ Battle System
- **PvP Battles** - Fight other players
- **Rating System** - Climb the ranks
- **Betting** - Wager cowoncy on battles
- **Win/Loss Tracking** - Track your battle history

### 👥 Social Features
- **Profiles** - View detailed player stats
- **Pray System** - Bless others with cowoncy
- **Emotes** - Hug, kiss, and more
- **Leaderboards** - Compete for top spots

### 🎨 Fun Commands
- **OwoText** - Transform text into owo speak
- **8Ball** - Ask the magic 8ball
- **Dice Rolling** - Roll custom-sided dice

### 📊 Progression
- **Level System** - Gain XP from chatting
- **Zoo Score** - Build the best collection
- **Battle Rating** - Competitive ranking
- **Achievements** - Track your progress

## 🚀 Installation

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or Atlas)
- Discord Bot Token

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd owo-bot
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add:
- `BOT_TOKEN` - Your Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)
- `MONGODB_URI` - Your MongoDB connection string

4. **Create Discord Bot**
- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Create a new application
- Go to "Bot" section and create a bot
- Enable these Privileged Gateway Intents:
  - ✅ Presence Intent
  - ✅ Server Members Intent
  - ✅ Message Content Intent
- Copy the bot token

5. **Invite Bot to Server**
Use this URL (replace CLIENT_ID with your application ID):
```
https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot
```

6. **Start the bot**
```bash
npm start
```

## 📝 Command List

### Economy Commands
- `owo daily` - Claim daily reward
- `owo cowoncy [@user]` - Check balance
- `owo give @user <amount>` - Give money
- `owo quest` - View/claim daily quest

### Animal Commands
- `owo hunt` - Hunt for animals
- `owo zoo [@user]` - View collection
- `owo sell <animal> [amount]` - Sell animals
- `owo sell <rank>` - Sell all of a rarity

### Gambling Commands
- `owo slots <amount>` - Play slots
- `owo coinflip <amount> <h/t>` - Flip a coin
- `owo blackjack <amount>` - Play blackjack

### Battle Commands
- `owo battle @user [bet]` - Fight someone

### Social Commands
- `owo profile [@user]` - View stats
- `owo pray @user` - Bless someone
- `owo hug @user` - Hug someone

### Fun Commands
- `owo owo <text>` - Owoify text
- `owo 8ball <question>` - Ask 8ball
- `owo roll [sides]` - Roll dice

### Admin Commands
- `owo help [command]` - Show commands
- `owo top <category>` - View leaderboards
  - Categories: `cowoncy`, `zoo`, `level`, `battle`

## 🎮 Animal Rarities

| Rarity | Chance | Base Value |
|--------|--------|------------|
| Common | 55% | 5-7 |
| Uncommon | 25% | 12-16 |
| Rare | 12% | 45-60 |
| Epic | 5% | 180-220 |
| Mythical | 2% | 500-700 |
| Legendary | 0.8% | 2000-3000 |
| Special | 0.2% | 10000+ |

## 🗂️ Project Structure

```
owo-bot/
├── commands/
│   ├── economy/      # Money commands
│   ├── animals/      # Hunt, zoo, sell
│   ├── gambling/     # Slots, coinflip, blackjack
│   ├── battles/      # PvP battles
│   ├── social/       # Profile, pray, emotes
│   ├── fun/          # Owo, 8ball, roll
│   └── admin/        # Help, leaderboard
├── events/
│   ├── ready.js      # Bot startup
│   └── messageCreate.js  # Command handler
├── models/
│   └── User.js       # User database schema
├── utils/
│   ├── animals.js    # Animal data
│   └── helpers.js    # Utility functions
├── index.js          # Main bot file
├── package.json
└── .env.example
```

## 🔧 Configuration

### Database
The bot uses MongoDB to store user data. You can use:
- **Local MongoDB**: `mongodb://localhost:27017/owobot`
- **MongoDB Atlas**: Free cloud database
  - Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
  - Create cluster and get connection string
  - Add to `.env` file

### Daily Reset
The bot automatically resets daily rewards and quests at midnight UTC.

## 🛠️ Customization

### Adding Animals
Edit `utils/animals.js` to add more animals to each rarity tier.

### Adjusting Rewards
Modify values in:
- `commands/economy/daily.js` - Daily reward amounts
- `utils/helpers.js` - Quest rewards
- `utils/animals.js` - Animal values

### Changing Cooldowns
Edit the `cooldown` property in each command file (in seconds).

## 📊 Database Schema

The bot stores:
- User balances and economy stats
- Animal collections
- Battle records and ratings
- Quest progress
- Daily claim status
- Gambling statistics
- Social connections

## 🐛 Troubleshooting

### Bot not responding
- Check if bot is online
- Verify Message Content Intent is enabled
- Check bot has permissions in the channel

### Database connection failed
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP is whitelisted (for Atlas)

### Commands not working
- Ensure prefix is correct (`owo `)
- Check for typos in command names
- Verify bot has message permissions

## 📄 License

This is a fan-made recreation inspired by the original OwO bot. Not affiliated with the official OwO bot.

**Note**: This follows CC-BY-NC-SA-4.0 licensing principles:
- ✅ Free to use and modify
- ✅ Must credit original
- ❌ No commercial use
- ✅ Share modifications under same license

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For issues or questions:
1. Check this README first
2. Review command usage: `owo help <command>`
3. Check bot console for errors

## 🎉 Features Coming Soon

- [ ] Marriage system
- [ ] Team battles
- [ ] Weapon shop
- [ ] Lootboxes
- [ ] Special events
- [ ] More animals
- [ ] Custom emotes
- [ ] Pet battles with stats

---

Made with ❤️ for Discord communities!

**Enjoy your OwO bot!** 🐺✨
