import express from 'express';
import fetch from 'node-fetch';

const app = express();

// CORS first
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ 
        status: 'online',
        hasApiKey: !!process.env.HUGGINGFACE_API_KEY
    });
});

app.post('/api/gemini', async (req, res) => {
    console.log('Request received');
    
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt' });
        }

        const response = await fetch(
            'https://api-inference.huggingface.co/models/google/flan-t5-large',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: prompt })
            }
        );

        const data = await response.json();
        
        let text = Array.isArray(data) ? data[0]?.generated_text || JSON.stringify(data) : data.generated_text || JSON.stringify(data);
        
        res.json({ response: text });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default app;
