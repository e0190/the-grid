'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    alert('Email login is disabled. Please use Sign in with Google.');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0a0a0a' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '700px', background: '#121212', border: '1px solid #222', borderRadius: '8px', overflow: 'hidden' }}>
        
        {/* Left Side: Email */}
        <div style={{ flex: '1', padding: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 20px 0' }}>Sign In</h2>
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="email" 
              placeholder="Email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff', outline: 'none' }} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff', outline: 'none' }} 
            />
            <button type="submit" style={{ padding: '10px', background: '#222', color: '#888', border: '1px solid #333', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>
              Log In
            </button>
          </form>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '1px', height: '60%', background: '#222' }}></div>
        </div>

        {/* Right Side: Google */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px' }}>
          <button 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px', 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              borderRadius: '4px', 
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#000" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.214 1.055 15.46 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.894 11.57-11.79 0-.795-.085-1.4-.195-1.905H12.24z"/>
            </svg>
            Sign in with Google
          </button>
        </div>

      </div>
    </div>
  );
}
