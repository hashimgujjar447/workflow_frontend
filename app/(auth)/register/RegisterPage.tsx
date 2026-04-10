"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useRegisterMutation } from "@/store/services/authApi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(form).unwrap();

      toast.success("Account created successfully");

      router.push(
        redirect
          ? `/login?redirect=${encodeURIComponent(redirect)}`
          : "/login"
      );
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.data?.email?.[0] ||
        err?.data?.username?.[0] ||
        "Registration failed";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-3"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <input
          name="first_name"
          placeholder="First Name"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="last_name"
          placeholder="Last Name"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="username"
          placeholder="Username"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link
            href={
              redirect
                ? `/login?redirect=${encodeURIComponent(redirect)}`
                : "/login"
            }
            className="text-blue-500"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}