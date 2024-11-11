import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeProvider from "@/components/context/themeProvider";
import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import BackgroundWrapper from "@/components/context/backgroundWrapper";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import 'react-toastify/dist/ReactToastify.min.css'; // minified version

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
  title: "Your App Name",
  description: "A more detailed description of your app for SEO purposes",
  openGraph: {
    title: "Your App Name",
    description: "A brief description for social media sharing",
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            <BackgroundWrapper>
              <ToastContainer />
              <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {/* <Header /> */}
                <SideBar />
                {children}
              </main>
            </BackgroundWrapper>
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
