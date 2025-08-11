import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState: null,
    reducers:{
        addFeed: (state,action)=>action.payload
        ,
        removeUserFromFeed:(state,action)=> {
const newErr = state.filter((r)=>r._id !== action.payload);
return newErr;
        }
    }
});

export const {addFeed,removeUserFromFeed} = feedSlice.actions

export default feedSlice.reducer