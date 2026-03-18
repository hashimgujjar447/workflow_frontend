"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice/authSlice";
import { useLazyGetProfileQuery } from "@/store/services/authApi";

export default function AuthInitializer() {
  const dispatch = useDispatch();
  const [getProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshRes = await fetch(
          "http://localhost:8000/api/token/refresh/",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshRes.ok) throw new Error("No refresh");

        const data = await refreshRes.json();
        const access = data.access;

        localStorage.setItem("access", access);

        // 🔥 correct RTK call
        const user = await getProfile(undefined).unwrap();

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
  }, [dispatch, getProfile]);

  return null;
}