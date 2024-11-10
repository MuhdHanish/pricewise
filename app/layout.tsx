import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/navbar";
import { SonnerToastProiver } from "@/components/sonner-toast-provider";

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Pricewise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.className} ${spaceGrotesk.className} antialiased`}
      >
        <main className="max-w-10xl mx-auto">
          <NavBar />
          {children}
        </main>
        <SonnerToastProiver />
      </body>
    </html>
  );
}
