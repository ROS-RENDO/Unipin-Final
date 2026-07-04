const https = require('https');

const urls = [
  'https://cdn1.codashop.com/S/content/common/images/mno/mlbb_600x600.png',
  'https://cdn1.codashop.com/S/content/common/images/mno/genshin_impact_600x600.png',
  'https://cdn1.codashop.com/S/content/common/images/mno/pubg_mobile_600x600.png',
  'https://cdn1.codashop.com/S/content/common/images/mno/valorant_600x600.png',
  'https://cdn1.codashop.com/S/content/common/images/mno/freefire_600x600.png'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url}: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(e);
  });
});
