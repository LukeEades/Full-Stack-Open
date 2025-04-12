const Notification = ({ notification }) => {
  if (!notification) return <div></div>
  let { type, message } = notification
  return (
    <div className={type}>{message}</div>
  )
}

export default Notification