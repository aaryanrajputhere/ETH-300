const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Key check
const API_KEY = process.env.API_NINJAS_KEY;
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
app.get('/api/eth-price', async (req, res) => {
    try {
        if (!API_KEY) {
            console.warn("No API_NINJAS_KEY provided.");
            return res.status(500).json({ error: "not able to fetch" });
        }

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

        res.json({
            ...ethResponse.data,
            inrRate,
            isMock: false
        });
    } catch (error) {
        console.error("Error fetching ETH price:", error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch Ethereum price.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
