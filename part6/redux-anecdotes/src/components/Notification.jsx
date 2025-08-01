import { useSelector } from "react-redux"

const Notification = () => {
  const notification = useSelector(items => items.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  } 
  if (notification.message == "") {
    return <></>
  }
  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification