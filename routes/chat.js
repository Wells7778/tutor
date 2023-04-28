const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chat.controller')

router.get('/', chatController.indexPage)
router.post('/', chatController.chat)

module.exports = router