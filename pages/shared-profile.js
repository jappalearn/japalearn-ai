import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ReferralProfile from '../components/profile/ReferralProfile';

export default function SharedProfilePage() {
  const router = useRouter();

  // Connect the design's specific call to action back into your functional app!
  // When a user clicks "Take the Free Assessment" or "Get My Score", they are routed directly to your standard signup flow.
  const handleSignUp = () => {
    router.push('/signup'); 
  };

  return (
    <>
      <Head>
        <title>Adaeze Okafor's Migration Report | JapaLearn AI</title>
        <meta name="description" content="Check out Adaeze's UK migration readiness report and get your own personalized track." />
      </Head>
      {/* 
        This is the new design component. 
        It defaults to the Adaeze demo data if no profileData is passed.
      */}
      <ReferralProfile onSignUp={handleSignUp} />
    </>
  );
}
