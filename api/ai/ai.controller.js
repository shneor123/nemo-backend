const { getAiTextCompletion } = require('./ai.service')

async function getAiChecklist(req, res) {
    console.log('📥 קיבלנו בקשה ל-AI checklist')
    console.log('📄 req.body:', req.body)

    const prompt = req.body.prompt || req.body.sttInput
    console.log('📝 prompt שנשלח ל-OpenAI:', prompt)

    if (!prompt) {
        console.error('❌ לא נשלח prompt בבקשה')
        return res.status(400).send({ error: 'Missing prompt in request body' })
    }

    try {
        const result = await getAiTextCompletion(prompt)
        console.log('✅ קיבלנו תוצאה מ-OpenAI:', result)

        res.json(result)
    } catch (err) {
        console.error('💥 שגיאה בקבלת AI checklist:', err)
        res.status(500).send({ error: 'Failed to get AI checklist', details: err.message || err })
    }
}

module.exports = {
    getAiChecklist
}
