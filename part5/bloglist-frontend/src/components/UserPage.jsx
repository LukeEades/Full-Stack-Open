import { useParams } from "react-router"
import { useEffect, useState } from "react"
import axios from "axios"
import { Container, List, ListItem } from "@mui/material"

const UserPage = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  useEffect(() => {
    axios.get(`/api/users/${id}`).then(response => {
      setUser(response.data)
    })
  }, [])
  if (!user) return <div></div>
  return (
    <Container>
      <h2>{user.username}</h2>
      <h3>blogs added:</h3>
      <List>
        {user.blogs.map(blog => (
          <ListItem key={blog.id}>{blog.title}</ListItem>
        ))}
      </List>
    </Container>
  )
}

export default UserPage
