const fs = require('fs');
const path = require('path');
const https = require('https');

const games = [
  { id: 'mlbb', url: 'https://cdn1.codashop.com/S/content/common/images/mno/mlbb_600x600.png' },
  { id: 'genshin', url: 'https://cdn1.codashop.com/S/content/common/images/mno/genshin_impact_600x600.png' },
  { id: 'pubg', url: 'https://cdn1.codashop.com/S/content/common/images/mno/pubg_mobile_600x600.png' },
  { id: 'valorant', url: 'https://cdn1.codashop.com/S/content/common/images/mno/valorant_600x600.png' },
  { id: 'freefire', url: 'https://cdn1.codashop.com/S/content/common/images/mno/freefire_600x600.png' },
  { id: 'honkai', url: 'https://cdn1.codashop.com/S/content/common/images/mno/honkai_star_rail_600x600.png' },
  { id: 'clash', url: 'https://cdn1.codashop.com/S/content/common/images/mno/clash_of_clans_600x600.png' },
  { id: 'roblox', url: 'https://cdn1.codashop.com/S/content/common/images/mno/roblox_600x600.png' }
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.codashop.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
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
