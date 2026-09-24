import { ImageResponse } from 'next/og';

export const alt = 'Belal El-Shabrawy - Full-Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Generated at build time so links to the portfolio get a real preview card
// instead of a bare URL. No custom font is loaded on purpose: ImageResponse
// has a 500KB bundle budget and its default face is enough here.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0b1120 0%, #1e3a8a 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Belal El-Shabrawy
        </div>
        <div style={{ display: 'flex', marginTop: 16, fontSize: 40, color: '#93c5fd' }}>
          Full-Stack Developer
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 28,
            color: '#cbd5e1',
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          Next.js · TypeScript · React · Node.js · Firebase — building production web apps from Giza, Egypt
        </div>
      </div>
    ),
    { ...size }
  );
}
