const express = require('express');
const cors = require('cors'); //
const axios = require('axios');
const app = express();

app.use(cors()); //
app.use(express.json());

const SECRET_KEY = "AIzaSyCeh62ba_6SuUoFDbdVp4eIzBAfDtWYvjM";

app.post('/refine', async (req, res) => {
    try {
        const { prompt, text } = req.body;
        // FIXED URL: Using v1beta for better compatibility
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${SECRET_KEY}`,
            { contents: [{ parts: [{ text: `${prompt}: ${text}` }] }] }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "AI Engine Failed" });
    }
});

module.exports = app;
