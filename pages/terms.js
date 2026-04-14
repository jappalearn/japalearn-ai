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

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service — JapaLearn AI</title>
        <meta name="description" content="Terms of service and user agreement for JapaLearn AI educational platform." />
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
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">Terms of Service</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Agreement between JapaLearn AI and our valued learners. Please read these terms carefully.
                </p>
              </motion.div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
              <Section title="1. Acceptance of Terms">
                <p>
                  By accessing or using JapaLearn AI ("the Platform"), you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, you must not use or access the Platform. 
                  These terms constitute a legally binding agreement between you and JapaLearn AI.
                </p>
              </Section>

              <Section title="2. Educational Service Disclaimer">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
                  <p className="font-bold text-blue-900 uppercase text-xs tracking-widest mb-1">Important Legal Notice</p>
                  <p className="text-blue-800 text-sm italic">
                    JapaLearn AI is an <strong>educational intelligence platform</strong>. We are NOT a visa agency, law firm, 
                    or travel consultancy. We do NOT provide legal advice or guarantee visa approval. 
                    All information provided is for educational and informational purposes only.
                  </p>
                </div>
                <p>
                  Our AI roadmap and curriculum are designed to help you understand migration pathways, 
                  but final decisions and applications should be cross-referenced with official government sources 
                  (e.g., UK.gov, IRCC Canada). Use of the Platform does not create an attorney-client relationship.
                </p>
              </Section>

              <Section title="3. User Accounts & Security">
                <p>To access certain features, you must create an account. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information during registration.</li>
                  <li>Maintain the security of your password and account identifiers.</li>
                  <li>Promptly notify us of any unauthorised use of your account.</li>
                  <li>Be responsible for all activities that occur under your account.</li>
                </ul>
              </Section>

              <Section title="4. Intellectual Property">
                <p>
                  All content on the Platform, including AI algorithms, curriculum content, graphics, logos, and UI design, 
                  is the property of JapaLearn AI and is protected by copyright and intellectual property laws. 
                  You are granted a limited, non-exclusive license to use the platform for personal, non-commercial learning only.
                </p>
              </Section>

              <Section title="5. Prohibited Conduct">
                <p>You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Platform for any illegal purpose or in violation of these terms.</li>
                  <li>Attempt to scrape, reverse engineer, or steal the Platform's source code or data.</li>
                  <li>Share account access with multiple users or redistribute our curriculum content.</li>
                  <li>Provide false information to the AI assessment tool to manipulate results.</li>
                </ul>
              </Section>

              <Section title="6. Limitation of Liability">
                <p>
                  JapaLearn AI shall not be liable for any indirect, incidental, or consequential damages resulting from 
                  your use of the Platform or your migration decisions. We provide the services on an "as-is" and "as-available" basis 
                  without warranties of any kind regarding the constant accuracy of government immigration rules, 
                  which are subject to change without notice.
                </p>
              </Section>

              <Section title="7. Governing Law">
                <p>
                  These Terms are governed by and construed in accordance with the laws of the <strong>Federal Republic of Nigeria</strong>. 
                  Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Nigeria.
                </p>
              </Section>

              <Section title="8. Termination">
                <p>
                  We reserve the right to suspend or terminate your account and access to the Platform at our sole discretion, 
                  without notice, if you violate these terms or engage in conduct that we deem harmful to other users or our business.
                </p>
              </Section>

              <Section title="9. Changes to Terms">
                <p>
                  We may update these Terms of Service from time to time. We will notify users of any significant changes 
                  by posting the new terms on this page and updating the "Last Updated" date at the top. 
                  Your continued use of the Platform after such changes constitutes acceptance of the new terms.
                </p>
              </Section>

              <Section title="10. Contact Information">
                <p>
                  If you have questions about these Terms, please contact our legal team at:
                </p>
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl inline-block">
                  <p className="font-semibold text-gray-900">JapaLearn Legal Team</p>
                  <p className="text-gray-600">Email: support@japalearnai.com</p>
                  <p className="text-gray-600">Lagos, Nigeria</p>
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
