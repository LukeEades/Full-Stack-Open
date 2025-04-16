import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      return payload
    },
    removeUser: state => {
      return initialState
    },
  },
})

export const { setUser, removeUser } = slice.actions
export default slice.reducer
