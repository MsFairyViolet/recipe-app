import "./globals.css";

export const metadata = {
  title: "Recipe App",
  description: "Our personal food database",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="page-container">
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
