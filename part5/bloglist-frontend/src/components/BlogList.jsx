import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material"
import { useSelector } from "react-redux"
import { Link } from "react-router"

const BlogList = () => {
  const blogs = useSelector(items => items.blogs)
  return (
    <List>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <ListItem key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              <Typography>{blog.title}</Typography>
            </Link>
          </ListItem>
        ))}
    </List>
  )
}

export default BlogList
