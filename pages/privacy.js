import React from 'react'
import Head from 'next/head'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'

const BLUE_PRIMARY = '#1E4DD7'

const Section = ({ title, children }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-4 font-body">
      {children}
    </div>
  </div>
)

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — JapaLearn AI</title>
        <meta name="description" content="Privacy policy and data protection practices for JapaLearn AI. Compliant with NDPR and global standards." />
      </Head>

      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />

        <main className="grow pt-32 pb-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            {/* Hero Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Last Updated: April 14, 2026. Your privacy and data security are central to our mission at JapaLearn AI.
                </p>
              </motion.div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
              <Section title="1. Introduction">
                <p>
                  JapaLearn AI ("we," "our," or "us") is committed to protecting your personal data and your right to privacy. 
                  This Privacy Policy explains how we collect, use, and share information when you use our platform, 
                  including our website, AI migration tools, and educational services.
                </p>
                <p>
                  Our practices are governed by the <strong>Nigeria Data Protection Regulation (NDPR)</strong> and other applicable global privacy standards. 
                  By using our services, you consent to the data practices described in this policy.
                </p>
              </Section>

              <Section title="2. Information We Collect">
                <p>We collect information that you provide directly to us or that is generated automatically when you interact with our platform:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Identifiers:</strong> Name, email address, phone number (including WhatsApp number), and educational/professional background.</li>
                  <li><strong>Quiz & Assessment Data:</strong> Your answers to our migration readiness quizzes, scores, and calculated pathways.</li>
                  <li><strong>Account Information:</strong> Login credentials, profile settings, and course progress.</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device info, and how you navigate our site (via cookies and analytics).</li>
                </ul>
              </Section>

              <Section title="3. How We Use Your Information">
                <p>We process your data for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To generate your personalised migration roadmap and readiness reports.</li>
                  <li>To provide and manage your account and educational curriculum.</li>
                  <li>To communicate with you via email or <strong>WhatsApp</strong> regarding your progress, updates, or support.</li>
                  <li>To improve our AI algorithms and platform functionality.</li>
                  <li>To comply with legal obligations and prevent fraudulent activity.</li>
                </ul>
              </Section>

              <Section title="4. Data Protection & Security (NDPR)">
                <p>
                  We implement robust technical and organisational measures to secure your personal data. 
                  This includes end-to-end encryption for sensitive data, secure database hosting via Supabase, 
                  and strict access controls for our personnel.
                </p>
                <p>
                  Under the <strong>NDPR</strong>, we act as both a Data Controller and Data Processor, 
                  ensuring that your information is processed lawfully, fairly, and transparently.
                </p>
              </Section>

              <Section title="5. Your Rights as a Data Subject">
                <p>As a JapaLearn AI user, you have the following rights over your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
                  <li><strong>Right to Rectification:</strong> You can ask us to correct inaccurate or incomplete information.</li>
                  <li><strong>Right to Erasure:</strong> You can request that we delete your data (the "right to be forgotten").</li>
                  <li><strong>Right to Restrict Processing:</strong> You can object to certain data processing activities.</li>
                  <li><strong>Data Portability:</strong> You can request your data in a structured, commonly used format.</li>
                </ul>
              </Section>

              <Section title="6. Data Retention">
                <p>
                  We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. 
                  If you delete your account, we will remove your personal identifiers from our active systems, 
                  though some data may be kept in an anonymized form for analytical purposes.
                </p>
              </Section>

              <Section title="7. Third-Party Services">
                <p>
                  We may use third-party services (such as Supabase for authentication, Google Analytics for performance tracking, 
                  and communication tools) to enhance our platform. These partners are required to maintain the confidentiality 
                  of your information and are prohibited from using it for any other purpose.
                </p>
              </Section>

              <Section title="8. Contact Us">
                <p>
                  If you have any questions or concerns about this Privacy Policy or our data practices, 
                  please contact our Data Protection Officer at:
                </p>
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl inline-block">
                  <p className="font-semibold text-gray-900">Privacy & Compliance Team</p>
                  <p className="text-gray-600">Email: support@japalearnai.com</p>
                  <p className="text-gray-600">Location: Lagos, Nigeria</p>
                </div>
              </Section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
