import { createSlice } from "@reduxjs/toolkit"

const initialState = []

const slice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    appendBlog: (state, action) => {
      console.log(action)
      return [...state, action.payload]
    },
    setBlogs: (state, action) => {
      return action.payload
    },
    updateBlog: (state, action) => {
      return state.map(item =>
        item.id === action.payload.id ? action.payload : item
      )
    },
    deleteBlog: (state, { payload }) => {
      return state.filter(item => item.id != payload.id)
    },
  },
})

export const { appendBlog, setBlogs, updateBlog, deleteBlog } = slice.actions
export default slice.reducer
