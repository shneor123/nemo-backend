const express = require('express')
const {getAiChecklist} = require('./ai.controller')
const router = express.Router()


router.post('/', getAiChecklist)

module.exports = router