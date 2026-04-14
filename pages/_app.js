import { useEffect } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import { NewsletterModal } from '@/components/layout/NewsletterModal'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <>
      <Head>
        <title>JapaLearn AI — Your Migration Assistant</title>
        <link rel="icon" href="/images/jl-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
      <NewsletterModal />
    </>
  )
}
