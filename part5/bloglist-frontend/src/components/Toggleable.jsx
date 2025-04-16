import { Button } from "@mui/material"
import { useState, useImperativeHandle } from "react"

const Toggleable = ({ children, buttonLabel, toggleRef }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(toggleRef, () => {
    return {
      toggleVisibility,
    }
  })
  return (
    <div>
      {visible && children}
      <Button
        className="toggle-button"
        variant="contained"
        size="small"
        onClick={() => setVisible(!visible)}
      >
        {visible ? "hide" : buttonLabel}
      </Button>
    </div>
  )
}

export default Toggleable
