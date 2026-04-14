import Head from 'next/head'
import AuthCard from '../components/AuthCard'

export default function Login() {
  return (
    <>
      <Head><title>Sign In — JapaLearn AI</title></Head>
      <AuthCard defaultView="login" />
    </>
  )
}
