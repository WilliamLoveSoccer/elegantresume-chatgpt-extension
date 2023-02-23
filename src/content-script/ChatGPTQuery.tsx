import { useEffect, useState } from 'preact/hooks'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import { Answer } from '../messaging'

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
  const [isGettingAnswer, setIsGettingAnswer] = useState<boolean | null>(false)
  const [isGettingFirstResp, setIsGettingFirstResp] = useState<boolean | null>(null)
  const [port, setPort] = useState<Browser.Runtime.Port>()

  useEffect(() => {
    const port = Browser.runtime.connect()
    setPort(port)
    const listener = (msg: any) => {
      setIsGettingFirstResp(false)
      if (msg.text) {
        setAnswer(msg)
      } else if (msg.error) {
        setError(msg.error)
        props.onAnswerGenerated()
        setIsGettingAnswer(false)
      } else if (msg.event === 'DONE') {
        props.onAnswerGenerated()
        setIsGettingAnswer(false)
      }
    }
    if (props.prompt.length !== 0 && port) {
      setIsGettingFirstResp(true)
      setIsGettingAnswer(true)
      setError('')
      setAnswer(null)
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

  const onStopGenerating = () => {
    if (port && isGettingAnswer) {
      port.disconnect()
      props.onAnswerGenerated()
      setIsGettingAnswer(false)
      setIsGettingFirstResp(false)
    }
  }

  return (
    <>
      <div className="mb-3">
        <button className="px-3 py-2 rounded border border-gray-400" onClick={onStopGenerating}>
          {isGettingAnswer ? <span>Stop Generating</span> : <span>Stopped</span>}
        </button>
      </div>
      <div className="border border-gray-400 rounded p-3 text-lg">
        {!isGettingAnswer && !answer && !error && (
          <p className="">Welcome! Please select a resume section and get started!</p>
        )}
        {isGettingFirstResp && <p className="">Waiting for ChatGPT response...</p>}
        {answer && (
          <div className="" id="gpt-answer" dir="auto">
            <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
              {answer.text}
            </ReactMarkdown>
          </div>
        )}
        {(error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') && (
          <p>
            Please login and pass Cloudflare check at{' '}
            <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
              chat.openai.com
            </a>
          </p>
        )}
        {error && ((error !== 'UNAUTHORIZED' && error !== 'CLOUDFLARE') || retry > 0) && (
          <>
            <p>Failed to load response from ChatGPT:</p>
            <p>{error}</p>
            <p>Please refresh your browser and try again.</p>
            <p>It the error still exists, please log out your ChatGPT account and try again.</p>
          </>
        )}
      </div>
    </>
  )
}

export default memo(ChatGPTQuery)
