import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../scss/HomePage.scss";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/context/SessionProvider";
import { getServerSession } from "next-auth";
import Landing from "@/components/Landing";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elgoog Drive",
  description: "Google Drive Clone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  console.log("Session from layout component: ", session);

  return (
    <html lang="en">
      <body className={`bg-custom-nav ${inter.className}`}>
        <SessionProvider session={session}>
          {session ? (
            <div className="wrapper">
              <div className="sidebar">
                <Sidebar />
              </div>
              <div className="navbar">
                <Navbar />
              </div>
              <div className="content">{children}</div>
            </div>
          ) : (
            <Landing />
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
