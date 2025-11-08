import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'XeoDocs Admin App',
  description: 'Admin app for XeoDocs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
