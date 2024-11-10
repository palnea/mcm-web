"use client";
// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';


const RootLayout = ({ children }) => {
  // Vars
  const direction = 'ltr'

  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <html id='__next' dir={direction}>
      {/*<head>*/}
      {/*  <link rel="icon" href="" type="image/png" />*/}
      {/*  <title>MCM</title>*/}
      {/*</head>*/}

      <head>
        <link rel="icon"  href="/images/logo/favicon.png" type="image/png"/>
        <title>MCM</title>
      </head>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default appWithTranslation(RootLayout);
