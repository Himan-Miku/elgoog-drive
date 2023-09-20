import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../scss/HomePage.scss";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

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
            <Sidebar />
          </div>
          <div className="navbar">
            <Navbar />
          </div>
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
}
