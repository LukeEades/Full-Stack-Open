import axios from "axios"
import { useDispatch } from "react-redux"
import { useState } from "react"
import blogService from "../services/blogs"
import { setUser } from "../reducers/userReducer"
import { setNotif } from "../reducers/notificationReducer"
import { Button, Input, TextField } from "@mui/material"

const Loginform = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleLogin = async event => {
    event.preventDefault()
    try {
      let response = await axios.post("/api/login", { username, password })
      let userInfo = {
        ...response.data,
      }
      blogService.setToken(response.data.token)
      localStorage.setItem("user", JSON.stringify(userInfo))
      dispatch(setUser(userInfo))
    } catch (err) {
      console.log(err)
      dispatch(
        setNotif({
          type: "error",
          message: "one or more fields are incorrect",
        })
      )
    }
  }
  return (
    <form onSubmit={handleLogin} style={{ gap: 20, display: "flex" }}>
      <Input
        placeholder="username"
        type="text"
        onChange={({ target }) => setUsername(target.value)}
      />
      <Input
        placeholder="password"
        type="text"
        onChange={({ target }) => setPassword(target.value)}
      />
      <Button type="submit" variant="contained" size="small">
        Login
      </Button>
    </form>
  )
}

export default Loginform
