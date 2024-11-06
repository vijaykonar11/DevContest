import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modal: {
      type: null,
      isOpen: false,
    },
  },
  reducers: {
    setModal: (state, action) => {
      state.modal = {
        type: action.payload?.type,
        redirect: action.payload?.redirect,
        isOpen: true,
      };
    },
    closeModal: (state) => {
      state.modal = {
        type: null,
        isOpen: false,
      };
    },
  },
});

export const { setModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
