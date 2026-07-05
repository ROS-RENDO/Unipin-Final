const fs = require('fs');
const https = require('https');

async function download() {
    try {
        const url = 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_pink_color_version.svg';
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows)'
            }
        };
        const req = https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const blackSvg = data.replace(/#ff4655/g, '#000000').replace(/#FF4655/g, '#000000');
                
                // Original SVG viewbox is 1035 x 697.
                // Scale 0.7 -> 724.5 x 487.9
                // Translate X: (1024 - 724.5) / 2 = 150
                // Translate Y: (1024 - 487.9) / 2 = 268
                
                const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <rect width="1024" height="1024" fill="#ff4655" />
    <g transform="translate(150, 268) scale(0.7)">
        ${blackSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)[1]}
    </g>
</svg>`;
                fs.writeFileSync('../frontend/public/images/valorant.svg', finalSvg);
                console.log('Successfully saved centered SVG to public/images/valorant.svg');
            });
        });
    } catch(e) {
        console.error(e);
    }
}
download();
