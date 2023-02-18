import { useCallback } from 'preact/hooks'
import { useEffect, useState } from 'react'
import { TriggerMode } from '../config'
import ChatGPTQuery from './ChatGPTQuery'

interface Props {
  question: string
  triggerMode: TriggerMode
}

function ChatGPTContainer(props: Props) {
  // const [queryStatus, setQueryStatus] = useState<QueryStatus>()
  // const query = useSWRImmutable(
  //   queryStatus === 'success' ? 'promotion' : undefined,
  //   fetchPromotion,
  //   { shouldRetryOnError: false },
  // )
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
      // We only accept messages from ourselves
      if (event.source !== window) {
        return
      }

      if (event.data.type && event.data.type === 'ChatGPT_Prompt') {
        // console.log('Content script received: ' + event.data.text)
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
      <div className="chat-gpt-card">
        {/* <ChatGPTCard
          question={props.question}
          triggerMode={props.triggerMode}
          onStatusChange={setQueryStatus}
        /> */}
        <ChatGPTQuery
          prompt={prompt}
          propmtTracker={promptTracker}
          onAnswerGenerated={onAnswerGenerated}
        />
        {/* <p>testtest</p> */}
      </div>
      {/* {query.data && <Promotion data={query.data} />} */}
    </>
  )
}

export default ChatGPTContainer
