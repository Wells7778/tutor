const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  organization: 'org-UuYKKlxV6QpxGrFMEPW5I4Z2',
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)
const chat = ({ message }) => {
  return openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: '你是一位很有幫助的英語教學家教老師' },
      { role: 'user', content: message }
    ],
    max_tokens: 150,
  })
}


module.exports = {
  chat
}