// frontend/pages/create-campaign.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStateContext } from "../context/Campaign";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { ethers } from "ethers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";

export default function CreateCampaignPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    image: "",
    recipients: [""],
    deadline: new Date(),
  });
  const { createCampaign, isLoading, address } = useStateContext();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (session?.user) {
        setUserInfo({
          id: session.user.id,
          email: session.user.email,
          role: session.user.role || "USER",
        });
      }
    };

    fetchUserInfo();
  }, [session]);

  useEffect(() => {
    if (userInfo?.role === "FUNDRAISER" && address) {
      setForm((prevForm) => ({
        ...prevForm,
        recipients: [address],
      }));
    }
  }, [userInfo, address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (!address) {
        throw new Error("Wallet not connected");
      }
      console.log(form);
      const formattedTarget = ethers.parseEther(form.target);

      const validRecipients = form.recipients;

      const deadlineTimestamp = Math.floor(form.deadline.getTime() / 1000);
      if (isNaN(deadlineTimestamp) || deadlineTimestamp <= Date.now() / 1000) {
        setErrorMessage(
          "Invalid or past deadline. Please select a future date and time."
        );
        return;
      }

      await createCampaign({
        ...form,
        target: formattedTarget,
        recipients: validRecipients,
        deadline: deadlineTimestamp,
        owner: address,
      });
      router.push("/home");
    } catch (error) {
      console.error("Failed to create campaign:", error);
      setErrorMessage(
        error.message ||
          "Failed to create campaign. Please check the form and try again."
      );
    }
  };

  const addRecipient = () => {
    setForm({ ...form, recipients: [...form.recipients, ""] });
  };

  const handleRecipientChange = (index, event) => {
    const updatedRecipients = [...form.recipients];
    updatedRecipients[index] = event.target.value;
    setForm({ ...form, recipients: updatedRecipients });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#13131a] p-4">
      <h1 className="text-white text-3xl mb-4">Create a Campaign</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <FormField
          labelName="Title"
          placeholder="Enter campaign title"
          inputType="text"
          value={form.title}
          handleChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <FormField
          labelName="Description"
          placeholder="Enter campaign description"
          isTextArea
          value={form.description}
          handleChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <FormField
          labelName="Target"
          placeholder="ETH 0.1"
          inputType="text"
          value={form.target}
          handleChange={(e) => setForm({ ...form, target: e.target.value })}
        />
        <label htmlFor="recipients" className="text-white block mb-2">
          Recipients
        </label>
        {form.recipients.map((recipient, index) => (
          <div key={index} className="mb-2 flex">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-[#1e1e24] text-white border border-gray-600 focus:outline-none focus:border-[#8c6dfd] mr-2"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => handleRecipientChange(index, e)}
              disabled={userInfo?.role === "FUNDRAISER" && index === 0}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => {
                  const updatedRecipients = [...form.recipients];
                  updatedRecipients.splice(index, 1);
                  setForm({ ...form, recipients: updatedRecipients });
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {userInfo?.role === "CHARITY" && (
          <button
            type="button"
            onClick={addRecipient}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Add Recipient
          </button>
        )}
        <div className="mb-4">
          <label htmlFor="deadline" className="text-white block mb-2">
            Deadline
          </label>
          <DatePicker
            selected={form.deadline}
            onChange={(date) => setForm({ ...form, deadline: date })}
            showTimeSelect
            dateFormat="Pp"
            className="w-full px-4 py-2 rounded-md bg-[#1e1e24] text-white border border-gray-600 focus:outline-none focus:border-[#8c6dfd]"
            placeholderText="Select Date and Time"
            minDate={new Date()}
          />
        </div>
        <FormField
          labelName="Image"
          placeholder="Enter image URL"
          inputType="url"
          value={form.image}
          handleChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <CustomButton
          btnType="submit"
          title={isLoading ? "Creating..." : "Create Campaign"}
          styles="bg-[#8c6dfd] hover:bg-[#7b5de8] transition-all w-full mt-4"
        />
      </form>
    </div>
  );
}
