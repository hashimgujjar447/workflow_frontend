"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ consistent

    if (token) {
      dispatch(
        setCredentials({
          user: { email: "" }, // later API se load karna
          token,
        })
      );
    } else {
      //  important: mark initialized even if no token
      dispatch(
        setCredentials({
          user: null,
          token: "",
        })
      );
    }
  }, [dispatch]);

  return null;
}