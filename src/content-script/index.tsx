import { render } from 'preact'
import '../base.css'
import { getUserConfig, Theme } from '../config'
import { detectSystemColorScheme } from '../utils'
import ChatGPTContainer from './ChatGPTContainer'
import './styles.scss'

async function mount() {
  const siderbarContainer = document.getElementById('ChatGPT-Response-Container')
  console.log('sidebar container', siderbarContainer)
  if (siderbarContainer) {
    console.log('sidebar container exists!')
    const container = document.createElement('div')
    container.className = 'chat-gpt-container'

    const userConfig = await getUserConfig()
    let theme: Theme
    if (userConfig.theme === Theme.Auto) {
      theme = detectSystemColorScheme()
    } else {
      theme = userConfig.theme
    }
    if (theme === Theme.Dark) {
      container.classList.add('gpt-dark')
    } else {
      container.classList.add('gpt-light')
    }

    siderbarContainer?.appendChild(container)

    const warningMessage = document.getElementById('ChatGPT-Extension-Not-Available-Warning')
    if (warningMessage) warningMessage.style.display = 'none'

    render(<ChatGPTContainer />, container)
  }
}

async function run() {
  mount()
}

//will get the message when 'AiAssistant' component get mounted.
window.addEventListener(
  'message',
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
      return
    }

    if (event.data.type && event.data.type === 'Mount_ChatGPT') {
      console.log('Mounting ChatGpt.')
      run()
    }
  },
  false,
)
run() //ensure the the content is mounted when user refreshes in /app/builder
