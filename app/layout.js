import './globals.css'

export const metadata = {
  title: 'Prysal Printhub',
  description: '5+ Years of Excellence in Digital & Print Solutions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
