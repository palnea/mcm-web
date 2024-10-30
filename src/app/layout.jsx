"use client";
// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import {useEffect} from "react";
import {useRouter} from "next/navigation";


const RootLayout = ({ children }) => {
  // Vars
  const direction = 'ltr'

  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <html id='__next' lang='tr' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
