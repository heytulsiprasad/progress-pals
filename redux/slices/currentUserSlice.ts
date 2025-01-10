import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface CurrentUserState {
  uid: string;
  name: string;
  email?: string;
  photoURL: string | null;
}

const initialState: CurrentUserState = {
  uid: "",
  name: "",
  email: "",
  photoURL: null,
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<CurrentUserState>) => {
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.photoURL = action.payload.photoURL;
    },
    clearCurrentUser: (state) => {
      state.uid = "";
      state.name = "";
      state.email = "";
      state.photoURL = null;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions;

export const useCurrentUser = () => {
  return useSelector((state: RootState) => state.currentUser);
};

export default currentUserSlice.reducer;
