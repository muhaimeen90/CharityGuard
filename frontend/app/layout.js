import "./globals.css";
import { StateContextProvider } from "./context/Campaign";

export const metadata = {
  title: "CharityGuard",
  description:
    "A decentralized Blockchain-based platform for charitable causes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex-1 max-sm:w-full max-w-full mx-auto sm:pr-5">
        <StateContextProvider>{children}</StateContextProvider>
      </body>
    </html>
  );
}
