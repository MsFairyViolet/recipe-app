
import { ConfirmProvider } from "@components/common/ConfirmProvider";
import NavBar from "@components/common/NavBar"
import "./globals.css";

export const metadata = {
  title: "Recipe App",
  description: "Our personal food database",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", type: "image/png" },
      { url: "/icons/favicon-32x32.png", type: "image/png" }
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/favicon.ico",
  },
  manifest: "/icons/site.webmanifest"
 }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div className="page-container">
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </div>
      </body>
    </html>
  );
}
