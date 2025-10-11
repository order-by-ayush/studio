import type { Metadata } from 'next';
import { Inconsolata } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inconsolata = Inconsolata({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Ayush Das - Terminal Portfolio",
  description: "An interactive terminal-based portfolio for Ayush Das, showcasing projects, skills, and more.",
  openGraph: {
    title: "Ayush Das - Terminal Portfolio",
    description: 'An interactive terminal-based portfolio showcasing projects, skills, and more.',
    type: 'website',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", inconsolata.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
