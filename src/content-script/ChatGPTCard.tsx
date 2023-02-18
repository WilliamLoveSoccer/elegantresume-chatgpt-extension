import { TriggerMode } from '../config'
import { QueryStatus } from './ChatGPTQuery'

interface Props {
  question: string
  triggerMode: TriggerMode
  onStatusChange?: (status: QueryStatus) => void
}

function ChatGPTCard(props: Props) {
  // const [triggered, setTriggered] = useState(false)

  // if (props.triggerMode === TriggerMode.Always) {
  //   return <ChatGPTQuery question={props.question} onStatusChange={props.onStatusChange} />
  // }
  // if (props.triggerMode === TriggerMode.QuestionMark) {
  //   if (endsWithQuestionMark(props.question.trim())) {
  //     return <ChatGPTQuery question={props.question} onStatusChange={props.onStatusChange} />
  //   }
  //   return (
  //     <p className="icon-and-text">
  //       <LightBulbIcon size="small" /> Trigger ChatGPT by appending a question mark after your query
  //     </p>
  //   )
  // }
  // if (triggered) {
  //   return <ChatGPTQuery question={props.question} onStatusChange={props.onStatusChange} />
  // }
  // return (
  //   <p className="icon-and-text cursor-pointer" onClick={() => setTriggered(true)}>
  //     <SearchIcon size="small" /> Ask ChatGPT for this query
  //   </p>
  // )
  return <div></div>
}

export default ChatGPTCard
