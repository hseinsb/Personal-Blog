import type { Metadata } from "next";
import { Kalam } from "next/font/google";
import "./globals.css";
import "./refresh.css";
import "./mobile-fixes.css";
import "./ios-fix.css";
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
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Add cache control headers to prevent caching */}
        <meta
          httpEquiv="Cache-Control"
          content="no-store, max-age=0, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const isDark = localStorage.getItem('theme') === 'dark' || 
                                 (window.matchMedia('(prefers-color-scheme: dark)').matches &&
                                  localStorage.getItem('theme') !== 'light');
                  document.documentElement.classList.toggle('dark', isDark);
                  
                  // iOS-specific fix for blog cards
                  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
                  if (isiOS) {
                    // Add iOS class to html for targeting
                    document.documentElement.classList.add('ios-device');
                    
                    // Create a style element for iOS-specific fixes
                    const iosFix = document.createElement('style');
                    iosFix.textContent = \`
                      .bento-card { background-color: #1f2937 !important; }
                      .bento-card h2 { color: white !important; }
                      .bento-card p { color: #e5e7eb !important; }
                      .bento-card .text-gray-300, .bento-card .text-gray-500 { color: #d1d5db !important; }
                    \`;
                    document.head.appendChild(iosFix);
                  }
                  
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
