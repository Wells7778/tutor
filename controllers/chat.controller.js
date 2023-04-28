const service = require('../services/chat.services')
const ChatController = {
  async indexPage(req, res, next) {
    return res.render('chat')
  },
  async chat(req, res, next) {
    try {
      const { message } = req.body
      const { data: { choices } } = await service.chat({ message })
      const content = choices[0]?.message?.content || '我聽不懂你的問題，麻煩請再問一次，謝謝'
      return res.json({ content })
    } catch (error) {
      return res.json({ content: '錯誤' })
    }
  }
}

module.exports = ChatController
