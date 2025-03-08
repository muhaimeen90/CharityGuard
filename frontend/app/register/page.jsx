"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "../components/CustomButton";
import { useStateContext } from "../context/Campaign";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //const [smartWalletAddress, setSmartWalletAddress] = useState(""); // State for smart wallet address
  const router = useRouter();
  const { connect, address } = useStateContext();

  // Mock connect function (replace with your actual wallet connection logic)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Map the selected role to uppercase (matching prisma enum)
    const mappedRole = role.toUpperCase(); // "DONOR", "CHARITY", etc.

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            role: mappedRole,
            smartWalletAddress: address, // Include the smart wallet address in the request
          }),
        }
      );

      const data = await res.json();

      

      // Redirect to verification page with email pre-filled
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="bg-[#1c1c24] flex flex-col justify-center items-center min-h-screen p-4 rounded-[10px]">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-epilogue font-bold sm:text-[50px] text-[40px] leading-[60px] text-white">
          Register
        </h1>
        <p className="font-epilogue font-normal text-[18px] text-[#808191] mt-4 max-w-[600px]">
          Join CharityGuard and start making a difference today.
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
            <select
              className="w-full p-3 rounded-[10px] bg-[#3a3a43] text-white placeholder-[#808191] outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="charity">Charity</option>
              <option value="fundraiser">Fundraiser</option>
              <option value="donor">Donor</option>
            </select>

            {/* Smart Wallet Address Section */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="font-epilogue font-semibold text-[16px] text-[#1dc071] min-h-[52px] px-4 rounded-full bg-[#1c1c24] hover:bg-[#2c2f32] transition-all"
                onClick={connect}
              >
                {address ? "Connected" : "Connect"}
              </button>
              {address && (
                <input
                  type="text"
                  placeholder="Smart Wallet Address"
                  className="w-full p-3 rounded-[10px] bg-[#3a3a43] text-white placeholder-[#808191] outline-none"
                  value={address}
                  readOnly
                />
              )}
            </div>

            <CustomButton
              btnType="submit"
              title="Register"
              styles="bg-[#1dc071] w-full"
            />
          </div>
        </form>

        {errorMessage && (
          <p className="font-epilogue font-normal text-[16px] text-red-500 mt-6">
            {errorMessage}
          </p>
        )}

        <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-6">
          Already have an account?{" "}
          <span
            className="text-[#1dc071] cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import CustomButton from "../components/CustomButton";

// const RegisterPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     // Map the selected role to uppercase (matching prisma enum)
//     const mappedRole = role.toUpperCase(); // "DONOR", "CHARITY", etc.

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email,
//             password,
//             role: mappedRole,
//             smartWalletAddress,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Registration failed");
//       }

//       // Redirect to verification page with email pre-filled
//       router.push(`/verify-email?email=${encodeURIComponent(email)}`);
//     } catch (err) {
//       console.error(err);
//       setErrorMessage(err.message);
//     }
//   };

//   return (
//     <div className="bg-[#1c1c24] flex flex-col justify-center items-center min-h-screen p-4 rounded-[10px]">
//       <div className="flex flex-col items-center text-center">
//         <h1 className="font-epilogue font-bold sm:text-[50px] text-[40px] leading-[60px] text-white">
//           Register
//         </h1>
//         <p className="font-epilogue font-normal text-[18px] text-[#808191] mt-4 max-w-[600px]">
//           Join CharityGuard and start making a difference today.
//         </p>

//         <form onSubmit={handleSubmit} className="w-full max-w-[400px] mt-8">
//           <div className="flex flex-col gap-4">
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full p-3 rounded-[10px] bg-[#3a3a43] text-white placeholder-[#808191] outline-none"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full p-3 rounded-[10px] bg-[#3a3a43] text-white placeholder-[#808191] outline-none"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <select
//               className="w-full p-3 rounded-[10px] bg-[#3a3a43] text-white placeholder-[#808191] outline-none"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               required
//             >
//               <option value="" disabled>
//                 Select your role
//               </option>
//               <option value="charity">Charity</option>
//               <option value="fundraiser">Fundraiser</option>
//               <option value="donor">Donor</option>
//             </select>
//             <CustomButton
//               btnType="submit"
//               title="Register"
//               styles="bg-[#1dc071] w-full"
//             />
//           </div>
//         </form>

//         {errorMessage && (
//           <p className="font-epilogue font-normal text-[16px] text-red-500 mt-6">
//             {errorMessage}
//           </p>
//         )}

//         <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-6">
//           Already have an account?{" "}
//           <span
//             className="text-[#1dc071] cursor-pointer"
//             onClick={() => router.push("/login")}
//           >
//             Login here
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
