import type { Metadata } from "next";
import { Kalam } from "next/font/google";
import "./globals.css";
import "./refresh.css";
import "./mobile-fixes.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import CacheBuster from "@/components/CacheBuster";
import ClearCacheButton from "@/components/ClearCacheButton";

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
});

// Generate a unique version number for cache busting
const version = Date.now();

export const metadata: Metadata = {
  title: "Hussein's Philosophy Blog",
  description:
    "Personal theories and philosophies on religion, morals, philosophy, and personal growth",
  other: {
    version: version.toString(),
  },
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
        <meta
          http-equiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const isDark = localStorage.getItem('theme') === 'dark' || 
                                 (window.matchMedia('(prefers-color-scheme: dark)').matches &&
                                  localStorage.getItem('theme') !== 'light');
                  document.documentElement.classList.toggle('dark', isDark);
                  
                  // Force reload of CSS if it's older than 1 hour
                  const lastCssReload = localStorage.getItem('lastCssReload');
                  const now = Date.now();
                  if (!lastCssReload || (now - parseInt(lastCssReload)) > 3600000) {
                    localStorage.setItem('lastCssReload', now.toString());
                    const links = document.getElementsByTagName('link');
                    for (let i = 0; i < links.length; i++) {
                      const link = links[i];
                      if (link.rel === 'stylesheet') {
                        link.href = link.href + '?v=' + now;
                      }
                    }
                  }
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
          <CacheBuster />
          <Header />
          <div className="pt-20">{children}</div>
          <ClearCacheButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
