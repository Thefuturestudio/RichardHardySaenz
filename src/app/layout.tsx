import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-intra",
});

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi/Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Black.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-viva-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Viva Platform",
  description: "Multi-tenant SaaS foundation for Reserva Viva and Venta Viva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${satoshi.variable} ${dmSans.variable} min-h-screen font-sans antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const theme = localStorage.getItem("viva-theme"); document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light"; } catch (_) {} })();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
