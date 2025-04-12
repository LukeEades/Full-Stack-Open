import Blog from "./Blog"
import blogService from "../services/blogs"

const BlogList = ({ blogs, setBlogs, user }) => {
  const deleteBlog = (blog) => {
    setBlogs(blogs.filter(listBlog => listBlog.id !== blog.id))
  }
  const updateBlog = (oldBlog, newBlog) => {
    let updated = blogs.map(blog => {
      if (blog.id === oldBlog.id) {
        return newBlog
      }
      return blog
    })
    setBlogs(updated)
  }
  const addLike = async oldBlog => {
    let blogInfo = {
      ...oldBlog,
      likes: oldBlog.likes + 1
    }
    delete blogInfo.user
    let newBlog = await blogService.update(blogInfo)
    updateBlog(oldBlog, newBlog)
  }
  return (
    <>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog => <Blog key={blog.id} user={user} blog={blog} deleteBlog={deleteBlog} addLike={addLike}/>)}
    </>
  )
}

export default BlogList