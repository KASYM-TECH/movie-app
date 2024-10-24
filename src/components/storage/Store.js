import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';

// Create the Redux store and add the user slice to it
const Store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default Store;
