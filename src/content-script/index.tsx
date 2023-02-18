import { render } from 'preact'
import '../base.css'
import { getUserConfig, Theme } from '../config'
import { detectSystemColorScheme } from '../utils'
import ChatGPTContainer from './ChatGPTContainer'
import './styles.scss'

async function mount() {
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

  const siderbarContainer = document.getElementById('ChatGPT-Response-Container')
  siderbarContainer?.appendChild(container)

  const warningMessage = document.getElementById('ChatGPT-Extension-Not-Available-Warning')
  if (warningMessage) warningMessage.style.display = 'none'

  render(<ChatGPTContainer />, container)
}

async function run() {
  mount()
}

run()
