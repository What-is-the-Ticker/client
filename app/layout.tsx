import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeProvider from "@/components/context/themeProvider";
import BackgroundWrapper from "@/components/context/backgroundWrapper";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import 'react-toastify/dist/ReactToastify.min.css'; // minified version
import { WalletProviders } from "@/components/context/walletProvider";
import SolanaWalletProvider from "@/components/context/solanaProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Witt",
  description: "what is the ticker",
  openGraph: {
    title: "Witt",
    description: "what is the ticker",
    images: [{ url: "/og-image.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f0f0f" />
        <meta name="msapplication-TileColor" content="#0f0f0f" />
        <meta name="theme-color" content="#0f0f0f" />
      </head>
      <body>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            <WalletProviders>
              <SolanaWalletProvider>
                <BackgroundWrapper>
                  <ToastContainer />
                  <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    {children}
                  </main>
                </BackgroundWrapper>
              </SolanaWalletProvider>
            </WalletProviders>
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
