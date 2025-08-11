import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name:"connections",
    initialState: null,
    reducers:{
        addConnection: (state,action)=>action.payload,
    }
})

export const {addConnection} = connectionsSlice.actions;
export default connectionsSlice.reducer;