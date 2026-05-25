import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0a0a0a' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>The Grid</h1>
        <p style={{ color: '#888', fontSize: '1rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>
          Create and share your own custom HTML profile page.
        </p>
        <Link href="/auth/signin" style={{ 
          display: 'block',
          padding: '12px', 
          background: '#fff', 
          color: '#000', 
          textDecoration: 'none', 
          borderRadius: '6px', 
          fontWeight: '600',
          fontSize: '0.95rem',
          textAlign: 'center'
        }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
