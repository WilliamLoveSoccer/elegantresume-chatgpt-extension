import { useEffect, useState } from 'preact/hooks'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import { Answer } from '../messaging'
import { isBraveBrowser } from './utils.js'

export type QueryStatus = 'success' | 'error' | undefined

interface Props {
  prompt: string
  propmtTracker: number
  onAnswerGenerated: () => void
}

function ChatGPTQuery(props: Props) {
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [isSendingRequest, setIsSendingRequest] = useState<boolean | null>(null)

  useEffect(() => {
    const port = Browser.runtime.connect()

    const listener = (msg: any) => {
      setIsSendingRequest(false)
      if (msg.text) {
        setAnswer(msg)
      } else if (msg.error) {
        setError(msg.error)
      } else if (msg.event === 'DONE') {
        props.onAnswerGenerated()
      }
    }
    if (props.prompt.length !== 0 && port) {
      setIsSendingRequest(true)

      port.postMessage({ question: props.prompt })

      port.onMessage.addListener(listener)
    }

    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [props.prompt, props.propmtTracker])

  // retry error on focus
  useEffect(() => {
    const onFocus = () => {
      if (error && (error == 'UNAUTHORIZED' || error === 'CLOUDFLARE')) {
        setError('')
        setRetry((r) => r + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [error])

  if (isSendingRequest) return <p className="">Waiting for ChatGPT response...</p>
  if (answer) {
    return (
      <div className="" id="gpt-answer" dir="auto">
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
          {answer.text}
        </ReactMarkdown>
      </div>
    )
  }

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
    return (
      <p>
        Please login and pass Cloudflare check at{' '}
        <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
          chat.openai.com
        </a>
        {retry > 0 &&
          (() => {
            if (isBraveBrowser()) {
              return (
                <span className="block mt-2">
                  Still not working? Follow{' '}
                  <a href="https://github.com/wong2/chat-gpt-google-extension#troubleshooting">
                    Brave Troubleshooting
                  </a>
                </span>
              )
            } else {
              return (
                <span className="italic block mt-2 text-xs">
                  OpenAI requires passing a security check every once in a while. If this keeps
                  happening, change AI provider to OpenAI API in the extension options.
                </span>
              )
            }
          })()}
      </p>
    )
  }
  if (error) {
    return (
      <p>
        Failed to load response from ChatGPT:
        <span className="break-all block">{error}</span>
      </p>
    )
  }

  return <p className="">Welcome! Please select a resume section and get started!</p>
}

export default memo(ChatGPTQuery)
