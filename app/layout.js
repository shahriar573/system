import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "CloudLight — Deploy anything in seconds",
  description: "Zero-config Node.js cloud deployment platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
