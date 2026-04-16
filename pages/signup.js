import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AuthCard from '../components/AuthCard'
import { getMainUrl } from '../lib/urls'

export default function Signup() {
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      const { answers, score } = router.query
      if (!answers || !score) {
        window.location.href = getMainUrl('/quiz')
      }
    }
  }, [router.isReady, router.query, router])

  return (
    <>
      <Head><title>Create Account — JapaLearn AI</title></Head>
      <AuthCard defaultView="signup" />
    </>
  )
}
