import "./globals.scss";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../scss/HomePage.scss";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/context/SessionProvider";
import { getServerSession } from "next-auth";
import Landing from "@/components/Landing";
import { ResizeContextProvider } from "@/context/ResizeContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: "normal",
  subsets: ["latin"],
  variable: "--font-poppins",
});

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
    <html className="p-0 m-0 scrollbar" lang="en">
      <body className={`bg-custom-nav ${poppins.className}`}>
        <SessionProvider session={session}>
          {session ? (
            <ResizeContextProvider>
              <div className="wrapper">
                <div className="sidebar">
                  <Sidebar />
                </div>
                <div className="navbar">
                  <Navbar />
                </div>
                <div className="content">{children}</div>
              </div>
            </ResizeContextProvider>
          ) : (
            <Landing />
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
