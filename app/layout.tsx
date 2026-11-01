import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

// Manrope no texto; JetBrains Mono em números, etiquetas e dados técnicos.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--fonte-texto",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--fonte-mono",
});

export const metadata: Metadata = {
  title: "Meu CRM",
  description: "Seus contatos e oportunidades de negócio em um só lugar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
