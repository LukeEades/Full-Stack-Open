import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const slice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload
    },
    reset: state => {
      return initialState
    },
  },
})

const { set, reset } = slice.actions

export const setNotif = (notif, delay = 5) => {
  delay *= 1000
  return dispatch => {
    dispatch(set(notif))
    setTimeout(() => dispatch(reset()), delay)
  }
}
export default slice.reducer
