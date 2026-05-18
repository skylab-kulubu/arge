import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arge.yildizskylab.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SKY LAB · Ar-Ge Ekipleri",
    template: "%s | SKY LAB Ar-Ge",
  },
  description:
    "SKY LAB Bilgisayar Bilimleri Kulübü Ar-Ge ekipleri — yapay zekâdan siber güvenliğe, oyun geliştirmeden gömülü sistemlere kadar dokuz farklı alanda birlikte üreten teknoloji topluluğu.",
  keywords: [
    "SKY LAB", "Skylab", "Ar-Ge", "YTÜ", "Yıldız Teknik Üniversitesi",
    "bilgisayar bilimleri kulübü", "teknoloji topluluğu", "yazılım",
    "yapay zeka", "siber güvenlik", "web geliştirme", "mobil geliştirme",
    "oyun geliştirme", "blockchain", "gömülü sistemler", "algoritma",
  ],
  authors: [{ name: "SKY LAB" }],
  creator: "SKY LAB",
  publisher: "SKY LAB",
  openGraph: {
    title: "SKY LAB · Ar-Ge Ekipleri",
    description:
      "Dokuz farklı alanda birlikte üreten teknoloji topluluğu. Ekipleri keşfet, hedeflerine en uygun alanı bul, başvuru sürecini başlat.",
    type: "website",
    locale: "tr_TR",
    siteName: "SKY LAB Ar-Ge",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "SKY LAB · Ar-Ge Ekipleri",
    description:
      "Dokuz farklı alanda birlikte üreten teknoloji topluluğu. Ekipleri keşfet, hedeflerine en uygun alanı bul.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="tr"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="bg-neutral-950 text-white">{children}</body>
    </html>
  );
}
