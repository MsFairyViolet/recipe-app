
import { ConfirmProvider } from "@components/common/ConfirmProvider";
import NavBar from "@components/common/NavBar"
import "./globals.css";

export const metadata = {
  title: "Recipe App",
  description: "Our personal food database",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/icons/site.webmanifest" />
      </head>
      <body>
        <NavBar />
        <div className="page-container">
          <main>
            <ConfirmProvider>
              {children}
            </ConfirmProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
