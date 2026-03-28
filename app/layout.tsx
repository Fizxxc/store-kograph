import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maintenance | KOGRAPH STUDIO.ID",
  description: "Website sedang dalam proses maintenance dan akan kembali online sesuai jadwal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
