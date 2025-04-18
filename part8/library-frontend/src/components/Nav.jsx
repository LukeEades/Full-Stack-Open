import { Link } from "react-router"
import LoginForm from "./LoginForm"
import { useApolloClient } from "@apollo/client"
const Nav = ({ token, setToken }) => {
  const client = useApolloClient()
  const style = {
    backgroundColor: "grey",
    display: "flex",
    gap: 20,
    padding: 10,
  }
  const linkStyle = {
    color: "black",
  }
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  return (
    <div style={style}>
      <Link style={linkStyle} to="/">
        authors
      </Link>
      <Link style={linkStyle} to="/books">
        books
      </Link>
      {token ? (
        <Link style={linkStyle} to="/addBook">
          add Book
        </Link>
      ) : (
        <LoginForm setToken={setToken} />
      )}
      {token && (
        <Link style={linkStyle} to="/recommendations">
          recommendations
        </Link>
      )}
      {token && <button onClick={logout}>logout</button>}
    </div>
  )
}
export default Nav
