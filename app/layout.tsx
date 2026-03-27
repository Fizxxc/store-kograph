import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KOGRAPH STUDIO.ID",
  description: "Web payment QRIS realtime dengan Cashify by Kograph Studio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
