"use client";
import {
  GameProvider,
  KeyboardProvider,
  MatchProvider,
  ModalProvider,
  PlayerProvider,
} from "@/context";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { WordleHeader } from "@/components";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />

        <PlayerProvider>
          <MatchProvider>
            <GameProvider>
              <ModalProvider>
                <KeyboardProvider>
                  <WordleHeader />
                  <main>{children}</main>
                </KeyboardProvider>
              </ModalProvider>
            </GameProvider>
          </MatchProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
