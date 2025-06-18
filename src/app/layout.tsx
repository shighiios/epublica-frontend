import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from 'react';
import StoryblokProvider from '../components/StoryblokProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ePublica - Latest Articles",
  description: "A modern news platform powered by Storyblok CMS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-amber-50 text-gray-900 font-serif">
        <StoryblokProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </StoryblokProvider>
      </body>
    </html>
  );
}
