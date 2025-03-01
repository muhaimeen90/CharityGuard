"use client";
import Link from "next/link";
import { useState } from "react";
import CustomButton from "../components/CustomButton";

export default function LoginPage() {
  // Add state to hold email/password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      // For example, store token in localStorage:
      localStorage.setItem("token", data.token);
      console.log("Successfully logged in!", data);
      setRedirect(true);
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  if (redirect) {
    window.location.href = "/home";
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 rounded-[10px]">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-epilogue font-bold sm:text-[50px] text-[40px] leading-[60px] text-white">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] mt-8">
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-[10px] bg-[#3a3a43] text-white placeholder-[#808191] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-[10px] bg-[#3a3a43] text-white placeholder-[#808191] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <CustomButton
              btnType="submit"
              title="Login"
              styles="bg-[#1dc071] w-full"
            />
          </div>
        </form>
        <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#1dc071] cursor-pointer">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}