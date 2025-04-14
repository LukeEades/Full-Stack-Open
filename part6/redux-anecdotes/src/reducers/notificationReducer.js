import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    message: ""
}

const slice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotificationMessage(state, action) {
            state.message = action.payload
        },
        removeNotification(state) {
            state.message = initialState.message
        }
    }
})

export const setNotification = (content, timeout) => {
    timeout = timeout? timeout * 1000: 5000
    return async dispatch => {
        dispatch(setNotificationMessage(content))
        setTimeout(() => dispatch(removeNotification()), timeout);
    }
}
export const { setNotificationMessage, removeNotification } =  slice.actions
export default slice.reducer