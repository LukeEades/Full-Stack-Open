import NotificationContext from "../NotificationContext"
import { useContext } from "react"
const Notification = () => {
  const [notification] = useContext(NotificationContext)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  if (!notification.message) return <div></div>
  return (
    <div style={style}>
      {notification.message}      
    </div>
  )
}

export default Notification
