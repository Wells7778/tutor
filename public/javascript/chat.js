const input = document.querySelector('#question')
const btn = document.querySelector('#submitBtn')
const chatRoom = document.querySelector('#chat-room .char-room-wrapper')

const chat = async (e) => {
  e.stopPropagation()
  const url = '/chat'
  const message = input.value
  try {
    const params = { message }
    addQuestion(message)
    input.value = ''
    btn.classList.toggle('disabled')
    const { status, data: { content }} = await axios.post(url, params)
    if (status !== 200) throw new Error('請再問一次')
    addAnswer(content)
    btn.classList.toggle('disabled')
  } catch (error) {
    addAnswer(error.message)
  }
}

const addQuestion = (message) => {
  chatRoom.innerHTML += `
    <div class="row justify-content-end">
      <div class="col message message-q ps-2">
        ${message}
      </div>
    </div>
  `
}

const addAnswer = (message) => {
  chatRoom.innerHTML += `
    <div class="row justify-content-start">
      <div class="col message message-a ps-2">
        ${message}
      </div>
    </div>
  `
}

btn.addEventListener('click', chat)
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    btn.click()
  }
})

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    addAnswer('請問有什麼可以幫你的嗎？')
  }, 1000);
})