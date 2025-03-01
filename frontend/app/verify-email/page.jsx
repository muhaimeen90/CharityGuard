"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // "success", "error", or ""
  const router = useRouter();

  useEffect(() => {
    // Get email from URL parameter if available
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setStatus("");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message || "Email verified successfully!");
        setStatus("success");
        
        // Redirect to login after successful verification
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setMessage(data.error || "Verification failed.");
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
      setStatus("error");
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setMessage("Please enter your email address first.");
      setStatus("error");
      return;
    }
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("OTP has been resent to your email.");
        setStatus("success");
      } else {
        setMessage(data.error || "Failed to resend OTP.");
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while trying to resend the OTP.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#13131a] p-4">
      <div className="bg-[#3a3a43] p-6 rounded-xl max-w-md w-full">
        <h2 className="text-white text-2xl font-bold mb-4">Email Verification</h2>
        <p className="text-gray-300 mb-4">
          Please enter the verification code sent to your email address.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white outline-none"
            required
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white outline-none"
            required
          />
          <button
            type="submit"
            className="bg-green-500 p-3 rounded text-white font-bold hover:bg-green-600"
          >
            Verify Email
          </button>
          
          <button
            type="button"
            onClick={handleResendOTP}
            className="bg-blue-500 p-3 rounded text-white font-bold hover:bg-blue-600"
          >
            Resend OTP
          </button>
        </form>
        
        {message && (
          <p className={`mt-4 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}