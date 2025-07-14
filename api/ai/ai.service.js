const axios = require('axios');

async function getAiTextCompletion(prompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-opus',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer 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`,
        },
      }
    );

    const text = response.data.choices[0].message.content;
    const todoTitles = text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.?\s*/, ''));

    return {
      checklistTitle: prompt,
      todoTitles,
    };
  } catch (err) {
    console.error('Error from Claude:', err.response?.data || err);
    throw err;
  }
}


module.exports = {
    getAiTextCompletion
}
