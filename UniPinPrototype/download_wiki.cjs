const fs = require('fs');
const path = require('path');
const https = require('https');

const games = [
  { id: 'mlbb', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Mobile_Legends_Bang_Bang_logo.png/320px-Mobile_Legends_Bang_Bang_logo.png' },
  { id: 'genshin', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Genshin_Impact_logo.svg/320px-Genshin_Impact_logo.svg.png' },
  { id: 'pubg', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/44/PlayerUnknown%27s_Battlegrounds_Mobile.webp/320px-PlayerUnknown%27s_Battlegrounds_Mobile.webp.png' },
  { id: 'valorant', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Valorant_logo_-_pink_color_version.svg/320px-Valorant_logo_-_pink_color_version.svg.png' },
  { id: 'freefire', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Garena_Free_Fire_Logo.png/320px-Garena_Free_Fire_Logo.png' },
  { id: 'honkai', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Honkai_Star_Rail.png/320px-Honkai_Star_Rail.png' },
  { id: 'clash', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/34/Clash_of_Clans_icon.png/320px-Clash_of_Clans_icon.png' },
  { id: 'roblox', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/320px-Roblox_player_icon_black.svg.png' }
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir, { recursive: true });
}

async function run() {
  for (const game of games) {
    const filename = path.join(imagesDir, `${game.id}.png`);
    try {
      console.log(`Downloading ${game.id}...`);
      await downloadImage(game.url, filename);
      console.log(`Saved ${game.id}.png`);
    } catch (e) {
      console.error(`Error with ${game.id}:`, e.message);
    }
  }
}

run();
