const crypto = require('crypto');
const ABA_MERCHANT_ID = 'ec476567';
const ABA_PUBLIC_KEY = 'ea1d7833918362f84244aa9c47a3cb963b7c68d6';
const ABA_API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';

const getReqTime = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

const req_time = getReqTime();
const tran_id = `TX-${Math.floor(Math.random() * 900000000) + 100000000}`;
const formattedAmount = "1000";
const items = Buffer.from(JSON.stringify([{ name: 'Game Topup', quantity: '1', price: formattedAmount }])).toString('base64');
const return_url = Buffer.from("http://localhost:5173/history").toString('base64');

async function testHash(paymentOption) {
    const dataString = req_time + ABA_MERCHANT_ID + tran_id + formattedAmount + items + paymentOption + return_url;
    const hash = crypto.createHmac('sha512', ABA_PUBLIC_KEY).update(dataString).digest('base64');
    
    const formBody = new URLSearchParams({
        req_time,
        merchant_id: ABA_MERCHANT_ID,
        tran_id,
        amount: formattedAmount,
        items,
        hash,
        return_url,
        payment_option: paymentOption,
    });

    try {
        const abaResponse = await fetch(ABA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody.toString(),
        });
        const abaData = await abaResponse.json();
        console.log(`Format: ${paymentOption} ->`, abaData);
    } catch(e) {
        console.error(e);
    }
}

async function run() {
    await testHash('abapay');
    await testHash('abapay_khqr');
}
run();
