import { GlobeIcon } from '@primer/octicons-react'
import useSWR from 'swr'
import Browser from 'webextension-polyfill'
import '../base.css'
import logo from '../logo.png'

const isChrome = /chrome/i.test(navigator.userAgent)

function App() {
  const accessTokenQuery = useSWR(
    'accessToken',
    () => Browser.runtime.sendMessage({ type: 'GET_ACCESS_TOKEN' }),
    { shouldRetryOnError: false },
  )

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex flex-row items-center px-1">
        <img src={logo} className="w-5 h-5 rounded-sm" />
        <p className="text-sm font-semibold m-0 ml-1">ChatGPT for ElegantResume</p>
      </div>
      {(() => {
        if (accessTokenQuery.isLoading) {
          return (
            <div className="grow justify-center items-center flex animate-bounce">
              <GlobeIcon size={24} />
            </div>
          )
        }
        if (accessTokenQuery.data) {
          return (
            <div>
              <h1 className="text-2xl font-semibold">
                Thanks for using ChatGPT for ElegantResume!
              </h1>
              <p>
                Now you can open your resume using Elegant Resume Builder and get feedback from
                ChatGPT.
              </p>
              <p>
                The extension is open source, and the code base can be found on{' '}
                <a
                  href="https://github.com/WilliamLoveSoccer/elegantresume-chatgpt-extension"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </p>
              <p>
                If you have any questions, comments, or suggestions, please contact me via my{' '}
                <a
                  href="https://www.xiaohongshu.com/user/profile/6151b7ce0000000002019648?xhsshare=WeixinSession&appuid=6151b7ce0000000002019648&apptime=1676757164"
                  target="_blank"
                  rel="noreferrer"
                >
                  小红书
                </a>{' '}
                for a quick response.
              </p>
            </div>
          )
        }
        return (
          <div className="grow flex flex-col justify-center">
            <p className="text-base px-2 text-center">
              Please login and pass Cloudflare check at{' '}
              <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
                chat.openai.com
              </a>
            </p>
          </div>
        )
      })()}
    </div>
  )
}

export default App
