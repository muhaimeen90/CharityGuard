import Providers from "./components/Providers";
import "./globals.css";

export const metadata = {
  title: "CharityGuard",
  description: "Web3 Charity Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}