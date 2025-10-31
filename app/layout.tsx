import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReservasiKu - Platform Booking untuk Bisnis Anda",
  description: "Platform booking online untuk barbershop, nail art, photobooth, dan bisnis layanan lainnya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
