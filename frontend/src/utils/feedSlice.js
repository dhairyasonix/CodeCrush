import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [], 
  reducers: {
    addFeed: (state, action) => {
      return action.payload || [];
    },
    removeUserFromFeed: (state, action) => {
      const userId = action.payload?.toString(); // 🔥 normalize id
      return state.filter((r) => r._id?.toString() !== userId); // 🔥 safe compare
    },
    clearFeed: ()=>{
    return [];
}
  },
});

export const { addFeed, removeUserFromFeed,clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
