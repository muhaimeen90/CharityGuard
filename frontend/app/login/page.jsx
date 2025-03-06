"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import CustomButton from "../components/CustomButton";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        setError("Invalid email or password");
      } else {
        router.push("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1c1c24] flex flex-col justify-center items-center min-h-screen p-4 rounded-[10px]">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-epilogue font-bold sm:text-[50px] text-[40px] leading-[60px] text-white">
          Login
        </h1>
        <p className="font-epilogue font-normal text-[18px] text-[#808191] mt-4 max-w-[600px]">
          Sign in to your CharityGuard account
        </p>

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

            {error && (
              <p className="font-epilogue font-normal text-[16px] text-red-500">
                {error}
              </p>
            )}

            <CustomButton
              btnType="submit"
              title={isLoading ? "Signing in..." : "Login"}
              styles="bg-[#1dc071] w-full"
              disabled={isLoading}
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
