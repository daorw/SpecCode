import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'speccode — 需求驱动开发工具',
  description: '以需求文档为唯一开发入口的智能编程工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
