import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
      padding: '0 20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '900', 
          letterSpacing: '-1px', 
          margin: '0 0 15px 0',
          background: 'linear-gradient(180deg, #fff 0%, #aaa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          The Grid
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.2rem', 
          maxWidth: '500px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          A minimalist social network built entirely on customizable raw profiles. Powered securely by your GitHub engine.
        </p>
      </div>
      
      <div style={{ 
        padding: '2.5rem 3.5rem', 
        border: '1px solid #222', 
        borderRadius: '12px', 
        textAlign: 'center', 
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '500', margin: '0 0 1.5rem 0', color: '#eee' }}>
          Access the Network
        </h2>
        <Link href="/auth/signin" style={{ 
          display: 'inline-block',
          padding: '12px 40px', 
          background: '#fff', 
          color: '#000', 
          textDecoration: 'none', 
          borderRadius: '6px', 
          fontWeight: '600',
          fontSize: '1rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
        }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
