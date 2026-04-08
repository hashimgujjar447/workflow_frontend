"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "@/store/slices/authSlice/authSlice";
import { useLazyGetProfileQuery } from "@/store/services/authApi";
import { RootState } from "@/store/store";

export default function AuthInitializer() {
  const dispatch = useDispatch();
  const [getProfile] = useLazyGetProfileQuery();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}token/refresh/`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshRes.ok) throw new Error("No refresh");

        const data = await refreshRes.json();
        const access = data.access;

      
        dispatch(
          setCredentials({
            user, 
            token: access,
          })
        );

        if (!user) {
  const freshUser = await getProfile(undefined).unwrap();

  dispatch(setCredentials({ user: freshUser, token: access }));
}
      } catch (err) {
        console.log(err);
        dispatch(logout());
      }
    };

    initAuth();
  }, [dispatch, getProfile]);

  return null;
}