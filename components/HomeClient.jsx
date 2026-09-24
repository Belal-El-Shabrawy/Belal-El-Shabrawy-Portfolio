'use client';

import dynamic from 'next/dynamic';

// ssr:false is only allowed inside a Client Component, so the boundary lives
// here instead of in app/page.jsx — that keeps the page itself a Server
// Component, which is what lets it export `metadata`.
const Home = dynamic(() => import('@/components/Home'), { ssr: false });

export default function HomeClient() {
  return <Home />;
}
