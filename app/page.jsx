import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>Welcome to The Grid</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>A social network built entirely on profiles. Database powered by GitHub.</p>
      
      <div style={{ padding: '2rem', border: '1px solid #333', borderRadius: '8px', textAlign: 'center', backgroundColor: '#111' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>Create a profile?</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/api/auth/signin" style={{ padding: '10px 20px', background: '#fff', color: '#000', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            YES (Log in with Google)
          </Link>
        </div>
      </div>
    </div>
  );
}
