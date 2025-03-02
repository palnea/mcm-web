'use client'

import 'react-perfect-scrollbar/dist/css/styles.css'
import '@/app/globals.css'
// import '../assets/iconify-icons/generated-icons.css'
import './generated-icons.css'

export default function RootLayout({ children }) {
  return (
    <html id="__next">
      <head>
        <link rel="icon" href="/images/logo/favicon.ico" type="image/x-icon" />
        <title>TSmart Marine</title>
      </head>
      <body className="flex is-full min-bs-full flex-auto flex-col">
        {children}
      </body>
    </html>
  )
}
