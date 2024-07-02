import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { isCardVisible: {} },
  reducers: {
    toggle(state, action) {
      const personId = action.payload;
      state.isCardVisible[personId] = !state.isCardVisible[personId];
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
