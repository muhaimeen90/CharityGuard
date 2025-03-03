"use client";

import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStateContext } from '../context/Campaign';
import { navlinks } from '../constants';
import { search, menu } from '../assets';

const Navbar = () => {
  const { data: session, status } = useSession();
  const { connect, address } = useStateContext();
  const router = useRouter();

  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input 
          type="text" 
          placeholder="Search for campaigns" 
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" 
        />
        
        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <img src={search} alt="search" className="w-[15px] h-[15px] object-contain"/>
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <button
          className="font-epilogue font-semibold text-[16px] text-[#1dc071] min-h-[52px] px-4 rounded-full bg-[#1c1c24] hover:bg-[#2c2f32] transition-all"
          onClick={() => connect()}
        >
          {address ? 'Connected' : 'Connect'}
        </button>

        {status === "authenticated" ? (
          <button
            className="font-epilogue font-semibold text-[16px] text-white min-h-[52px] px-4 rounded-full bg-[#1dc071] hover:bg-[#14a85d] transition-all"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="font-epilogue font-semibold text-[16px] text-white min-h-[52px] px-4 rounded-full bg-[#1dc071] hover:bg-[#14a85d] transition-all flex items-center justify-center">
            Login
          </Link>
        )}

        <Link href="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src="/images/profile.svg" alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img src={search} alt="user" className="w-[60%] h-[60%] object-contain" />
        </div>

        <img 
          src={toggleDrawer ? "/images/close.svg" : menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  
                  if (link.name === "logout" && session) {
                    handleLogout();
                  } else if (!link.disabled) {
                    router.push(link.link);
                  }
                }}
              >
                <img 
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar;