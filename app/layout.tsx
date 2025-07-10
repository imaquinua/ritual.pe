import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RITUAL.pe - El Arte del Ritual Parrillero',
  description: 'Cortes premium para los verdaderos maestros de la brasa. Cada corte cuenta una historia de excelencia y tradición.',
  keywords: 'carne premium, parrilla, ritual, cortes nobles, delivery, Lima, Perú',
  authors: [{ name: 'Ritual.pe' }],
  creator: 'Ritual.pe',
  publisher: 'Ritual.pe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ritual.pe'),
  openGraph: {
    title: 'RITUAL.pe - El Arte del Ritual Parrillero',
    description: 'Cortes premium para los verdaderos maestros de la brasa.',
    url: 'https://ritual.pe',
    siteName: 'RITUAL.pe',
    images: [
      {
        url: '/img/ritual.png',
        width: 1200,
        height: 630,
        alt: 'RITUAL.pe - Cortes Premium',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RITUAL.pe - El Arte del Ritual Parrillero',
    description: 'Cortes premium para los verdaderos maestros de la brasa.',
    images: ['/img/ritual.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-ritual-stone-950 text-ritual-stone-100`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}