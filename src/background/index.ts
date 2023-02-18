import Browser from 'webextension-polyfill'
import { ChatGPTProvider, getChatGPTAccessToken } from './providers/chatgpt'

async function generateAnswers(port: Browser.Runtime.Port, question: string) {
  const token = await getChatGPTAccessToken()
  const provider = new ChatGPTProvider(token)

  const controller = new AbortController()
  port.onDisconnect.addListener(() => {
    controller.abort()
    cleanup?.()
  })

  const { cleanup } = await provider.generateAnswer({
    prompt: question,
    signal: controller.signal,
    onEvent(event) {
      if (event.type === 'done') {
        port.postMessage({ event: 'DONE' })
        return
      }
      port.postMessage(event.data)
    },
  })
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    console.debug('received msg', msg)
    try {
      await generateAnswers(port, msg.question)
    } catch (err: any) {
      console.error(err)
      port.postMessage({ error: err.message })
    }
  })
})

Browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'GET_ACCESS_TOKEN') {
    return getChatGPTAccessToken()
  }
})
