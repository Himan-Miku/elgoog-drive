import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Button from "./Button";
import "./HomePage.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elgoog Drive",
  description: "Google Drive Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-custom-backg ${inter.className}`}>
        <div className="wrapper">
          <div className="sidebar">
            <h1>Sidebar</h1>
            <Button />
          </div>
          <div className="navbar">
            <h1>Your Daughter Navbar</h1>
          </div>
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
}
