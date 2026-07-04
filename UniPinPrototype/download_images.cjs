const fs = require('fs');
const path = require('path');
const https = require('https');

const games = [
  { id: 'mlbb', query: 'mobile legends bang bang wallpaper 1920x1080 filetype:jpg' },
  { id: 'genshin', query: 'genshin impact wallpaper 1920x1080 filetype:jpg' },
  { id: 'pubg', query: 'pubg mobile wallpaper 1920x1080 filetype:jpg' },
  { id: 'valorant', query: 'valorant wallpaper 1920x1080 filetype:jpg' },
  { id: 'freefire', query: 'garena free fire wallpaper 1920x1080 filetype:jpg' },
  { id: 'honkai', query: 'honkai star rail wallpaper 1920x1080 filetype:jpg' },
  { id: 'clash', query: 'clash of clans wallpaper 1920x1080 filetype:jpg' },
  { id: 'roblox', query: 'roblox wallpaper 1920x1080 filetype:jpg' }
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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

// Fallback direct URLs that work
const directUrls = {
  mlbb: 'https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/789a7f34abf53f95dc1cc2ebbc057088.png',
  genshin: 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_GenshinImpact_miHoYoLimited_S2_1200x1600-c12cdcc2cac330df2185aa58c508e820',
  pubg: 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg',
  valorant: 'https://cdn1.epicgames.com/offer/cb2604e4fae843c0800b39678147d341/EGS_VALORANT_RiotGames_S2_1200x1600-4b13bd73315a0c329bd22c6082269a23',
  freefire: 'https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/1bd68383a8b2cd3963480ed5dd570831.png',
  honkai: 'https://cdn1.epicgames.com/offer/21e1fa625292437da6b9c9bcfe06b001/EGS_HonkaiStarRail_COGNOSPHEREPTE_LTD_S2_1200x1600-8488e0b60abcf0ceb68e0d5f8c6ebf7b',
  clash: 'https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/e352c38d3abfbcae6973ff4d284f67c6.png',
  roblox: 'https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/1d50c1825b410fb5dd06e123af6c6abf.png'
};

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir, { recursive: true });
}

async function run() {
  for (const game of games) {
    const filename = path.join(imagesDir, `${game.id}.jpg`);
    try {
      console.log(`Downloading ${game.id}...`);
      await downloadImage(directUrls[game.id], filename);
      console.log(`Saved ${game.id}.jpg`);
    } catch (e) {
      console.error(`Error with ${game.id}:`, e.message);
    }
  }
}

run();
