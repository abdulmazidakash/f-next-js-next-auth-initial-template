import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme='light'>
      <NextAuthSessionProvider>
          <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
          <div className="shadow">
            <Navbar/>
          </div>
          {children}
          <div className="shadow border-t border-gray-200">
            <Footer/>
          </div>
        </body>
      </NextAuthSessionProvider>
    </html>
  );
}
