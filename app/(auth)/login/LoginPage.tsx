"use client";

import { useState } from "react";
import { useLoginMutation } from "@/store/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams=useSearchParams()
    const redirect = searchParams.get('redirect')
const redirectParam = redirect ? encodeURIComponent(redirect) : ''

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();

     console.log("Login responce ",res)
    
      dispatch(
        setCredentials({
          user: { email },
          token: res.access,
        })
      );

      // ✅ 3. redirect
      router.push(redirect || "/dashboard");

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
         <p className="text-sm mt-3 text-center">
                   Not have an account?{" "}
                 <Link
  href={redirect ? `/register?redirect=${redirectParam}` : '/register'}
  className="text-blue-500"
>
  Register
</Link>
                  
                </p>
      </form>
    </div>
  );
}