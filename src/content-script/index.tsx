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

  const siderbarContainer = document.getElementById('chatGPT-anwser')
  siderbarContainer?.appendChild(container)
  // const siderbarContainer = getPossibleElementByQuerySelector(siteConfig.sidebarContainerQuery)
  // if (siderbarContainer) {
  //   siderbarContainer.prepend(container)
  // } else {
  //   container.classList.add('sidebar-free')
  //   const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
  //   if (appendContainer) {
  //     appendContainer.appendChild(container)
  //   }
  // }

  render(
    <ChatGPTContainer question={'123'} triggerMode={userConfig.triggerMode || 'always'} />,
    container,
  )
}

// const siteRegex = new RegExp(Object.keys(config).join('|'))
// const siteName = location.hostname.match(siteRegex)![0]
// const siteConfig = config[siteName]

async function run() {
  // const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
  // if (searchInput && searchInput.value) {
  //   console.debug('Mount ChatGPT on', siteName)
  //   const userConfig = await getUserConfig()
  //   const searchValueWithLanguageOption =
  //     userConfig.language === Language.Auto
  //       ? searchInput.value
  //       : `${searchInput.value}(in ${userConfig.language})`
  //     }
  mount()
}

run()

// if (siteConfig.watchRouteChange) {
//   siteConfig.watchRouteChange(run)
// }
