import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpecCode - Requirement Analysis-Driven Programming Agent',
  description: 'Requirement-driven development tool — generate code from spec documents',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="stylesheet" href="/pi-web-ui/app.css" />
      </head>
      <body className="h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
