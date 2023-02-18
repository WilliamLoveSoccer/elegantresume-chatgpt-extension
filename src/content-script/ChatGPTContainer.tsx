import { useCallback } from 'preact/hooks'
import { useEffect, useState } from 'react'
import ChatGPTQuery from './ChatGPTQuery'

function ChatGPTContainer() {
  const [prompt, setPrompt] = useState('')
  const [promptTracker, setPromptTracker] = useState(0)
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false)

  useEffect(() => {
    window.addEventListener('message', onGetPrompt)
    return () => {
      window.removeEventListener('message', onGetPrompt)
    }
  }, [isGeneratingAnswer])

  const onAnswerGenerated = () => {
    setIsGeneratingAnswer(false)
  }

  const onGetPrompt = useCallback(
    (event: any) => {
      if (event.source !== window) {
        return
      }

      if (event.data.type && event.data.type === 'ChatGPT_Prompt') {
        if (!isGeneratingAnswer) {
          setIsGeneratingAnswer(true)
          setPrompt(event.data.text)
          setPromptTracker((t) => t + 1)
        }
      }
    },
    [isGeneratingAnswer],
  )

  return (
    <>
      <div>
        <ChatGPTQuery
          prompt={prompt}
          propmtTracker={promptTracker}
          onAnswerGenerated={onAnswerGenerated}
        />
      </div>
    </>
  )
}

export default ChatGPTContainer
