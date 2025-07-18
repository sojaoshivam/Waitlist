import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { Component as SpotlightCursor } from '@/components/ui/spotlight-cursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TARS AI – AI Chatbot for PDFs | Chat with Your Documents | Document Intelligence Platform',
  description: 'Join the waitlist for TARS AI, the Interstellar-inspired AI document assistant. Chat with your PDFs, search documents with AI, and boost productivity with a secure, multilingual, RAG-based knowledge assistant for teams and enterprises.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="TARS AI – AI Chatbot for PDFs | Chat with Your Documents" />
        <meta property="og:description" content="Join the waitlist for TARS AI, the Interstellar-inspired AI document assistant. Chat with your PDFs, search documents with AI, and boost productivity with a secure, multilingual, RAG-based knowledge assistant for teams and enterprises." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tarsai.com" />
        <meta property="og:image" content="/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TARS AI – AI Chatbot for PDFs | Chat with Your Documents" />
        <meta name="twitter:description" content="Join the waitlist for TARS AI, the Interstellar-inspired AI document assistant. Chat with your PDFs, search documents with AI, and boost productivity with a secure, multilingual, RAG-based knowledge assistant for teams and enterprises." />
        <meta name="twitter:image" content="D:\waitlist\Waitlist\public\favicon.svg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </Head>
      <body className={inter.className}>
        <SpotlightCursor />
        {children}
      </body>
    </html>
  );
}