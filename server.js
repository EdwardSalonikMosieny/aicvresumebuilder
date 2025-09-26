require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

// AI Enhancement Endpoint
app.post('/api/enhance', async (req, res) => {
  try {
    const { section, content, role } = req.body;
    
    let prompt;
    switch(section) {
      case 'summary':
        prompt = `Improve this professional summary for a ${role} resume to be more compelling and achievement-oriented:\n\n${content}`;
        break;
      case 'experience':
        prompt = `Enhance these job bullet points to be more quantitative and impactful for a ${role} resume:\n\n${content}`;
        break;
      case 'skills':
        prompt = `Suggest 5 additional relevant skills for a ${role} based on these skills:\n\n${content}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid section' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 250
    });

    res.json({ enhanced: response.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`AI server running on port ${PORT}`));