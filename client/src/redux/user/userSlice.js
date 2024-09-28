import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    role: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        signInStart: (state)=> {
            state.loading = true
        },
        signInSuccess: (state,action)=>{
            state.currentUser = action.payload,
            state.role = action.payload.role,
            state.loading = false,
            state.error = null
        },
        signInFailure: (state,action)=>{
            state.loading = false,
            state.error = action.payload
        },
        signOutStart: (state)=>{
            state.loading = true
        },
        signOutSuccess: (state)=>{
            state.loading = false,
            state.error = null,
            state.currentUser = null,
            state.role = null
        },
        signOutFailure: (state,action) =>{
            state.loading = false,
            state.error = action.payload
        },
    }
})
export const {
    signInStart,
    signInSuccess,
    signInFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure
} = userSlice.actions
export default userSlice.reducer;



