import { createSlice } from "@reduxjs/toolkit"
const initialState = ""

const slice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setFilter(state, action) {
            return action.payload
        }
    }
})

export const { setFilter } = slice.actions
export default slice.reducer