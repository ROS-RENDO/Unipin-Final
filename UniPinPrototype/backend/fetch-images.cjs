const urls = [
    'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/7b0680eb58af6cc73fcf0ce4e0c4b2b380ebbf30-3840x2160.jpg',
    'https://playvalorant.com/assets/images/home/play-free-desktop.jpg',
    'https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e561/wideart.png' // generic valorant art from valorant-api
];

async function check() {
    for (const url of urls) {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            console.log(url, res.status);
        } catch(e) {
            console.log(url, e.message);
        }
    }
}
check();
