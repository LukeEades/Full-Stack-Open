import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router"
import { Container, List, ListItem, Typography } from "@mui/material"
const UserList = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    axios.get("/api/users").then(response => {
      setUsers(response.data)
    })
  }, [])
  return (
    <Container>
      <List>
        {users.map(user => (
          <ListItem key={user.id}>
            <Link to={`/users/${user.id}`}>
              <Typography>{user.username}</Typography>
            </Link>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default UserList
