import React from "react";
import { useNavigate } from "react-router-dom";
import { money } from "../assets";
import { CustomButton } from "../components";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1c1c24] flex flex-col justify-center items-center min-h-screen p-4 rounded-[10px]">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-epilogue font-bold sm:text-[50px] text-[40px] leading-[60px] text-white">
          CharityGuard 
        </h1>
        <p className="font-epilogue font-normal text-[18px] text-[#808191] mt-4 max-w-[600px]">
            A decentralized Blockchain based platform for creating and supporting charitable causes.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <CustomButton
            btnType="button"
            title="Create a Campaign"
            styles="bg-[#1dc071]"
            handleClick={() => navigate("/create-campaign")}
          />
          <CustomButton
            btnType="button"
            title="Explore Campaigns"
            styles="bg-[#8c6dfd]"
            handleClick={() => navigate("/campaigns")}
          />
        </div>
      </div>

      <div className="w-full flex justify-center items-center p-4 bg-[#3a3a43] rounded-[10px] mt-12 max-w-[800px]">
        <img
          src={money}
          alt="money"
          className="w-[60px] h-[60px] object-contain"
        />
        <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
          100% of the raised amount goes directly to the cause.
        </h4>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-12">
        <div className="bg-[#3a3a43] p-6 rounded-[10px] max-w-[300px]">
          <h3 className="font-epilogue font-bold text-[22px] text-white">
            Transparency
          </h3>
          <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-2">
            Every transaction is recorded on the blockchain, ensuring complete transparency.
          </p>
        </div>
        <div className="bg-[#3a3a43] p-6 rounded-[10px] max-w-[300px]">
          <h3 className="font-epilogue font-bold text-[22px] text-white">
            Security
          </h3>
          <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-2">
            Your contributions are secure and directly support the causes you care about.
          </p>
        </div>
        <div className="bg-[#3a3a43] p-6 rounded-[10px] max-w-[300px]">
          <h3 className="font-epilogue font-bold text-[22px] text-white">
            Community
          </h3>
          <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-2">
            Join a global community of changemakers working together to make a difference.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;