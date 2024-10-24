import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: null,
    isLoggedIn: false,
    token: ""
};

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.userInfo = action.payload; // action.payload will contain user data
            state.isLoggedIn = true;

            localStorage.setItem("role", state.userInfo.role)
            localStorage.setItem("token", state.userInfo.token)
            localStorage.setItem("userId", state.userInfo.userId)
        },
        logout: (state) => {
            state.userInfo = null;
            state.isLoggedIn = false;
            localStorage.clear()
        },
    },
});

export const { login, logout } = UserSlice.actions;

export default UserSlice.reducer;
