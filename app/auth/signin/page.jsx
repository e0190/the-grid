'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    // Traditional login placeholder - since database is purely file-based on GitHub via email mapping, 
    // we alert the user or process verification if credentials systems are appended later.
    alert('Email login is currently under network maintenance. Please use the Google Sign-In panel.');
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      background: '#050505',
      fontFamily: 'sans-serif',
      padding: '0 20px'
    }}>
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: '850px', 
        background: '#0d0d0d', 
        border: '1px solid #1a1a1a', 
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
      }}>
        
        {/* LEFT SIDE: Email & Password Form */}
        <div style={{ flex: '1', padding: '3.5rem 3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 8px 0', color: '#fff' }}>Welcome back</h2>
          <p style={{ color: '#555', fontSize: '0.9rem', margin: '0 0 2rem 0' }}>Enter your grid credentials to authenticate.</p>
          
          <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#aaa', fontSize: '0.85rem', fontWeight: '500' }}>Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                style={{ 
                  padding: '12px', 
                  background: '#121212', 
                  border: '1px solid #222', 
                  borderRadius: '6px', 
                  color: '#fff', 
                  outline: 'none',
                  fontSize: '0.95rem'
                }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#aaa', fontSize: '0.85rem', fontWeight: '500' }}>Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ 
                  padding: '12px', 
                  background: '#121212', 
                  border: '1px solid #222', 
                  borderRadius: '6px', 
                  color: '#fff', 
                  outline: 'none',
                  fontSize: '0.95rem'
                }} 
              />
            </div>

            <button type="submit" style={{ 
              padding: '14px', 
              background: '#1a1a1a', 
              color: '#666', 
              border: '1px solid #262626', 
              borderRadius: '6px', 
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px'
            }}>
              Log In
            </button>
          </form>
        </div>

        {/* MIDDLE DIVIDER LINE */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '1px', height: '70%', background: '#222' }}></div>
          <span style={{ 
            position: 'absolute', 
            background: '#0d0d0d', 
            padding: '10px 0', 
            color: '#444', 
            fontSize: '0.8rem', 
            fontWeight: '600',
            letterSpacing: '1px' 
          }}>OR</span>
        </div>

        {/* RIGHT SIDE: Google Authentication */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3.5rem 3rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '500', margin: '0 0 10px 0', color: '#eee' }}>Instant Verification</h3>
          <p style={{ color: '#555', fontSize: '0.9rem', margin: '0 0 2rem 0', lineHeight: '1.5' }}>
            Instantly sync your network nodes using secure open authentication directly via Google.
          </p>
          
          <button 
            // Triggers Google login and forcefully redirects them straight back to /dashboard upon success
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '14px', 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255,255,255,0.05)',
              transition: 'transform 0.1s ease'
            }}
          >
            {/* Minimalist Inline SVG Google Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: 'block' }}>
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.214 1.055 15.46 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.894 11.57-11.79 0-.795-.085-1.4-.195-1.905H12.24z"/>
            </svg>
            Sign in with Google
          </button>
        </div>

      </div>
    </div>
  );
}
