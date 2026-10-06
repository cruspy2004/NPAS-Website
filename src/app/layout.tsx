import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WarpProvider } from "@/components/Warp";
import { site } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description:
    "NPAS is the NUST Physics and Astronomy Society. Talks, stargazing nights, workshops and Space Week.",
};

export const viewport: Viewport = {
  themeColor: "#05060a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen">
        <SmoothScroll />
        <WarpProvider>{children}</WarpProvider>
      </body>
    </html>
  );
}
