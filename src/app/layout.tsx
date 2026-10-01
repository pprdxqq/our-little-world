import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorker } from "@/components/service-worker";

export const metadata: Metadata = {
  title: "Our Little World",
  description: "A private little world for two.",
  applicationName: "Our Little World",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Our Little World", statusBarStyle: "black-translucent" }
};

export const viewport: Viewport = {
  width:"device-width", initialScale:1, viewportFit:"cover", themeColor:"#151326"
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}<ServiceWorker /></body></html>;
}