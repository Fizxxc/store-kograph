import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maintenance Sistem | KOGRAPH STUDIO.ID",
  description: "Website sedang dalam maintenance serius. Seluruh fitur dan akses sistem dinonaktifkan sementara.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
