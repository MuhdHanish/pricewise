import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/navbar";

const inter = Inter({ subsets: ['latin'] });
export const spaceGrotesk = Space_Grotesk({
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
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <main className="max-w-10xl mx-auto">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  );
}
