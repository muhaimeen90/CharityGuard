"use client";

import { SessionProvider } from "next-auth/react";
import { StateContextProvider } from "../context/Campaign";
import { NotificationProvider } from "../context/NotificationContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <StateContextProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </StateContextProvider>
    </SessionProvider>
  );
}
