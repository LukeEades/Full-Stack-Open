import axios from "axios"
const baseUrl = "/api/blogs"
let token

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blog) => {
  let response = await axios.post(baseUrl, blog, {
    headers: {
      "Authorization": token
    }
  })
  return response.data
}

const update = async blog => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, {
    headers: {
      "Authorization": token
    }
  })
  return response.data
}

const deleteBlog = async blog => {
  const response = await axios.delete(`${baseUrl}/${blog.id}`, {
    headers: {
      "Authorization": token
    }
  })
  return response.data
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}


export default { getAll, update, setToken, deleteBlog, create }