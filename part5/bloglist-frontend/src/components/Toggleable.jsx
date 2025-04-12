import { useState, useImperativeHandle } from "react"

const Toggleable = ({ children, buttonLabel, toggleRef }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(toggleRef, () => {
    return {
      toggleVisibility
    }
  })
  return (
    <div>
      {visible && children}
      <button className="toggle-button" onClick={() => setVisible(!visible)}>{visible? "hide": buttonLabel}</button>
    </div>
  )
}

export default Toggleable