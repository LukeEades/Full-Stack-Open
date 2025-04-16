import { useDispatch, useSelector } from "react-redux"
import blogService from "../services/blogs"
import { Link } from "react-router"
import Loginform from "./Loginform"
import { AppBar, Breadcrumbs, Button, Typography } from "@mui/material"
import { removeUser } from "../reducers/userReducer"
const Nav = () => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)
  const logout = () => {
    localStorage.removeItem("user")
    blogService.setToken(null)
    dispatch(removeUser(null))
  }
  const style = {
    backgroundColor: "grey",
    display: "flex",
    padding: 5,
    gap: 20,
    flexDirection: "row",
    justifyContent: "center",
  }
  return (
    <AppBar position="static" style={style}>
      <Typography>
        <Link to="/">blogs</Link>
      </Typography>
      <Typography>
        <Link to="/users">users</Link>
      </Typography>
      {user === null ? (
        <Loginform />
      ) : (
        <Typography>
          {user.username} logged in{" "}
          <Button variant="contained" size="small" onClick={logout}>
            logout
          </Button>
        </Typography>
      )}
    </AppBar>
  )
}

export default Nav
