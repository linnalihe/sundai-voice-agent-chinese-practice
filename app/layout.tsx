import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '普通话练习 · Talk To Me In Chinese',
  description: 'Your AI Chinese conversation partner — practice Mandarin through real dialogue',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-paper text-ink antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
