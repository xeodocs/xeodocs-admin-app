import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import './globals.css'

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CustomThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
