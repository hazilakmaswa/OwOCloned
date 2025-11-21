# How to Upload Custom Emojis for Slots

The custom emoji codes like `<:eggplant:417475705719226369>` only work if uploaded to your Discord server.

## Steps to Upload Emojis:

1. **Go to your Discord Server Settings** → **Emoji** → **Upload Emoji**

2. **Upload these files from `/home/nevdread/dev/repo_clones/owo-clone/assets/`:**
   - `slot_spin.gif` → Name it: `slot_spin` (animated)
   - `eggplant.webp` → Name it: `eggplant`
   - `heart.webp` → Name it: `heart`
   - `cherry.webp` → Name it: `cherry`
   - `w.webp` → Name it: `w`
   - `cash.webp` → Name it: `slotcash`
   - `cowoncy.webp` → Name it: `cowoncy`

3. **Get the Emoji IDs:**
   - In Discord, type `\:slot_spin:` and press Enter
   - It will show: `<a:slot_spin:YOUR_ID_HERE>`
   - Copy the full emoji code

4. **Update `/home/nevdread/dev/repo_clones/owo-clone/config/emojis.js`:**
   Replace the emoji IDs with your server's IDs:

   ```javascript
   spinning: {
       url: 'https://cdn.discordapp.com/emojis/YOUR_ID.webp?size=22&animated=true',
       emoji: '<a:slot_spin:YOUR_ID>'
   },
   eggplant: {
       url: 'https://cdn.discordapp.com/emojis/YOUR_ID.webp?size=22',
       emoji: '<:eggplant:YOUR_ID>',
       multiplier: 1,
       weight: 40
   },
   // ... repeat for all emojis
   ```

5. **Alternative - Use Standard Unicode Emojis:**
   If you don't want to upload custom emojis, I can change the slots to use standard emojis like 🍆 🍒 ❤️ instead.

## Why Custom Emojis?

Discord custom emojis are server-specific. The emoji codes from owo bot (`<:name:417475705719226369>`) only work for owo bot because they're from owo's server. For your bot to use custom emojis, they must be uploaded to a server your bot is in.
