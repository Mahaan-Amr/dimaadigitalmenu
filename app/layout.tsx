import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dima Digital Menu',
  description: 'Digital menu for restaurants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
