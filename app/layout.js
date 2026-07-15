import './globals.css'
import { Analytics } from "@vercel/analytics/next"
export const metadata = {
  title: {
    default: 'Prysal Creative Hub | Print & Design Services in Matale',
    template: '%s | Prysal Creative Hub'
  },
  description: 'Prysal Creative Hub in Matale, Sri Lanka offers premium printing and creative design services. From business cards, banners & flex printing to logo design, branding, and digital marketing — all under one roof.',
  keywords: ['printing services matale', 'design services matale', 'banner printing sri lanka', 'logo design matale', 'business cards matale', 'prysal', 'creative hub', 'branding sri lanka'],
  authors: [{ name: 'Prysal Creative Hub' }],
  creator: 'Prysal Creative Hub',
  openGraph: {
    title: 'Prysal Creative Hub | Print & Design Services in Matale',
    description: 'Premium printing and creative design services in Matale, Sri Lanka. Banners, business cards, logo design, digital marketing and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Prysal Creative Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prysal Creative Hub | Print & Design Services in Matale',
    description: 'Premium printing and creative design services in Matale, Sri Lanka.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
