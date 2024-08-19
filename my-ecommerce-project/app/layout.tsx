import './globals.css';
import { Metadata } from 'next';
import React from 'react';
import ClientProvider from './components/ClientProvider';

// Global metadata for the entire application
export const metadata: Metadata = {
  title: 'My E-commerce Project',
  description: 'Discover a wide range of products on My E-commerce Project.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
