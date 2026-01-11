import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  storeId: string;
  departmentId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    setUser(state, action: PayloadAction<User>){
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state){
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;
