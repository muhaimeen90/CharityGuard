"use client";

import { SessionProvider } from "next-auth/react";
import { StateContextProvider } from "../context/Campaign";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <StateContextProvider>{children}</StateContextProvider>
    </SessionProvider>
  );
}