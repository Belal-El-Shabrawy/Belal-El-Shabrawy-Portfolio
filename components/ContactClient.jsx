'use client';

import dynamic from 'next/dynamic';

// See components/HomeClient.jsx — ssr:false must sit in a Client Component so
// app/contact/page.jsx can stay a Server Component and export `metadata`.
const Contact = dynamic(() => import('@/components/Contact'), { ssr: false });

export default function ContactClient() {
  return <Contact />;
}
