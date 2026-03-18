"use client";

import { useState } from "react";
import { useLoginMutation } from "@/store/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();

      console.log(res)

      // ✅ 1. token save
      localStorage.setItem("token", res.access);

      // ✅ 2. Redux me save
      dispatch(
        setCredentials({
          user: { email },
          token: res.access,
        })
      );

      // ✅ 3. redirect
      router.push("/dashboard");

    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2 rounded">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}