const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// YOUR SECRET KEY - Put your actual Gemini Key between the quotes
const SECRET_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";

app.post('/refine', async (req, res) => {
    const { prompt, text } = req.body;
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${SECRET_KEY}`,
            {
                contents: [{ parts: [{ text: `${prompt}: ${text}` }] }]
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Intelligence Offline" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Engine Live`));
