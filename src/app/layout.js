import "./globals.css";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "Product management dashboard built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}