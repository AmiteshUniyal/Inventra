"use client";

import { useEffect } from "react";
import { useMeQuery } from "@/services/authAPI";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/authSlice";

export default function AuthInit() {
  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useMeQuery(undefined);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  return null;
}
