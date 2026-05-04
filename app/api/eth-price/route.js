import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    const API_KEY = process.env.API_NINJAS_KEY;
    const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

    if (!API_KEY) {
        return NextResponse.json({ error: "not able to fetch" }, { status: 500 });
    }

    try {
        const [ethResponse, exchangeResponse] = await Promise.all([
            axios.get('https://api.api-ninjas.com/v1/cryptoprice?symbol=ETHUSD', {
                headers: {
                    'X-Api-Key': API_KEY
                }
            }),
            axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`).catch(err => {
                console.error("Exchange API Error:", err.message);
                return null;
            })
        ]);

        const inrRate = exchangeResponse?.data?.conversion_rates?.INR || 83.5;

        return NextResponse.json({
            ...ethResponse.data,
            inrRate,
            isMock: false
        });
    } catch (error) {
        console.error("Error fetching ETH price:", error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to fetch Ethereum price.' }, { status: 500 });
    }
}
