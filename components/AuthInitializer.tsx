"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 🔥 1. refresh call (cookie se)
        const refreshRes = await fetch(
          "http://localhost:8000/api/token/refresh/",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshRes.ok) {
          throw new Error("No refresh");
        }

        const data = await refreshRes.json();
        const access = data.access;

        // 🔥 2. access save
        localStorage.setItem("access", access);

        // 🔥 3. profile fetch
        const profileRes = await fetch(
          "http://localhost:8000/api/profile/",
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        const user = await profileRes.json();

        // 🔥 4. Redux set
        dispatch(
          setCredentials({
            user,
            token: access,
          })
        );
      } catch (err) {
        dispatch(
          setCredentials({
            user: null,
            token: "",
          })
        );
      }
    };

    initAuth();
  }, [dispatch]);

  return null;
}