# OwO Bot - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Node.js
Download from: https://nodejs.org/ (v16 or higher)

### Step 2: Install MongoDB
**Option A - Local MongoDB:**
- Download from: https://www.mongodb.com/try/download/community
- Install and run MongoDB

**Option B - MongoDB Atlas (FREE Cloud):**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Whitelist your IP (0.0.0.0/0 for all IPs)

### Step 3: Create Discord Bot
1. Go to: https://discord.com/developers/applications
2. Click "New Application"
3. Name it "OwO Bot"
4. Go to "Bot" section
5. Click "Add Bot"
6. Enable these intents:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
7. Copy the bot token

### Step 4: Setup Bot Files
1. Extract the bot files to a folder
2. Open terminal/command prompt in that folder
3. Run: `npm install`
4. Copy `.env.example` to `.env`
5. Edit `.env`:
   ```
   BOT_TOKEN=your_bot_token_here
   MONGODB_URI=your_mongodb_connection_string
   ```

### Step 5: Invite Bot to Server
Replace `YOUR_CLIENT_ID` with your application ID from Discord Developer Portal:
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot
```

### Step 6: Start the Bot
```bash
npm start
```

## ✅ Testing Commands

Once bot is online, test with:
```
owo help
owo hunt
owo daily
owo profile
```

## 🔧 Common Issues

### Bot not responding?
- Check Message Content Intent is enabled
- Verify bot has permissions in channel
- Check console for errors

### Database error?
- Verify MongoDB is running (local)
- Check connection string (Atlas)
- Ensure IP is whitelisted (Atlas)

### Command not found?
- Prefix must be: `owo ` (with space)
- Check spelling
- Try `owo help`

## 📋 Default Prefix
```
owo <command>
```

## 🎮 Popular Commands
- `owo hunt` - Catch animals
- `owo zoo` - View collection
- `owo daily` - Get free money
- `owo slots 100` - Gamble
- `owo battle @user` - Fight
- `owo profile` - Your stats

## 💡 Tips
1. Use `owo daily` every day for streak bonus
2. Complete quests for extra cowoncy
3. Hunt often to build your zoo
4. Battle strategically with bets
5. Check leaderboards: `owo top`

## 📞 Need Help?
- Read the full README.md
- Check command help: `owo help <command>`
- Review console logs for errors

## 🎉 Enjoy!
Your OwO bot is ready! Start hunting animals and building your collection! 🐺✨
