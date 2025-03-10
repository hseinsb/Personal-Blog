import type { Metadata } from "next";
import { Kalam } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
});

export const metadata: Metadata = {
  title: "Hussein's Philosophy Blog",
  description:
    "Personal theories and philosophies on religion, morals, philosophy, and personal growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pass a script that checks local storage before page load to prevent flash
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const isDark = localStorage.getItem('theme') === 'dark' || 
                                 (window.matchMedia('(prefers-color-scheme: dark)').matches &&
                                  localStorage.getItem('theme') !== 'light');
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {
                  console.error('Error setting initial theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${kalam.variable} antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <Header />
          <div className="pt-20">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
