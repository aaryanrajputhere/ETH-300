import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    const CMC_API_KEY = process.env.CMC_API_KEY;
    const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

    if (!CMC_API_KEY) {
        return NextResponse.json({ error: "CMC API key missing" }, { status: 500 });
    }

    try {
        const [cmcResponse, exchangeResponse] = await Promise.all([
            axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1027', {
                headers: {
                    'X-CMC_PRO_API_KEY': CMC_API_KEY,
                    'Accept': 'application/json'
                }
            }),
            axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`).catch(err => {
                console.error("Exchange API Error:", err.message);
                return null;
            })
        ]);

        const ethData = cmcResponse.data.data["1027"];
        const ethPrice = ethData.quote.USD.price;
        const inrRate = exchangeResponse?.data?.conversion_rates?.INR || 83.5;

        return NextResponse.json({
            symbol: "ETHUSD",
            price: ethPrice.toFixed(2),
            inrRate,
            isMock: false
        });
    } catch (error) {
        console.error("Error fetching ETH price from CMC:", error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to fetch Ethereum price.' }, { status: 500 });
    }
}
