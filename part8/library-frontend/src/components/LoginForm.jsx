import { useState } from "react"
import { useMutation } from "@apollo/client"
import queries from "../queries"

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [login] = useMutation(queries.login)
  const handleLogin = async e => {
    e.preventDefault()
    try {
      const response = await login({
        variables: {
          username,
          password,
        },
      })
      const token = response.data.login.value
      localStorage.setItem("user-login-token", token)
      setToken(token)
      setUsername("")
      setPassword("")
    } catch (err) {
      console.error("unable to login:", err)
    }
  }
  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
