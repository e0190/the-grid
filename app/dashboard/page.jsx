'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [code, setCode] = useState(`<style>
  body {
    background: linear-gradient(135deg, #0f0c20 0%, #06040a 100%);
    color: #f3f1fe;
    font-family: 'Segoe UI', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 90vh;
    margin: 0;
  }
  .card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 3rem;
    border-radius: 24px;
    backdrop-filter: blur(20px);
    text-align: center;
    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
    max-width: 400px;
  }
  h1 {
    font-weight: 800;
    letter-spacing: -1px;
    margin: 0 0 10px 0;
    background: linear-gradient(90deg, #a855f7, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fillColor: transparent;
  }
  p { color: #8a8895; line-height: 1.6; }
</style>

<div class="card">
  <h1>The Matrix</h1>
  <p>Welcome to my custom sector on the grid. Built with raw code, compiled live through the repository engine.</p>
</div>`);

  const [status, setStatus] = useState('');
  const [checkingName, setCheckingName] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('grid_username');
    if (savedName) {
      setUsername(savedName);
      setIsRegistered(true);
    }
  }, []);

  const handleClaimUsername = async (e) => {
    e.preventDefault();
    if (!username || username.length < 3) {
      alert('Username must be at least 3 characters.');
      return;
    }
    
    setCheckingName(true);
    setStatus('Securing node coordinates...');

    const res = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (data.available) {
      setStatus('Coordinates clear. Allocating vault...');
      const createRes = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, htmlContent: code })
      });

      if (createRes.ok) {
        localStorage.setItem('grid_username', username);
        setIsRegistered(true);
        setStatus(`Identity secured: @${username}`);
      } else {
        setStatus('Error locking canvas. Try again.');
      }
    } else {
      setStatus('Identity coordinates already claimed. Try another.');
    }
    setCheckingName(false);
  };

  const saveProfileChanges = async () => {
    setStatus('Syncing changes to GitHub...');
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, htmlContent: code })
    });
    
    if (res.ok) {
      setStatus('Changes successfully committed to the main network.');
      setTimeout(() => setStatus(''), 4000);
    } else {
      const errorMsg = await res.text();
      setStatus(`Sync error: ${errorMsg}`);
    }
  };

  // ONBOARDING FLOW: Claim Username
  if (!isRegistered) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        background: '#030303',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ 
          maxWidth: '420px', 
          width: '100%',
          padding: '3rem 2.5rem', 
          backgroundColor: '#0a0a0a', 
          border: '1px solid #161616', 
          borderRadius: '16px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>Claim Your Identity</h1>
          <p style={{ color: '#555', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.5' }}>
            Choose a unique username to allocate your permanent routing space on the grid network.
          </p>
          
          <form onSubmit={handleClaimUsername} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: '#121212', 
              border: '1px solid #222', 
              borderRadius: '8px', 
              paddingLeft: '14px',
              transition: 'border-color 0.2s ease'
            }}>
              <span style={{ color: '#444', fontWeight: '600', fontSize: '0.95rem', userSelect: 'none' }}>/u/</span>
              <input 
                type="text" 
                placeholder="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase())}
                required
                disabled={checkingName}
                style={{ 
                  width: '100%', 
                  padding: '14px 10px', 
                  background: 'transparent', 
                  color: '#fff', 
                  border: 'none', 
                  outline: 'none',
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px'
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={checkingName} 
              style={{ 
                padding: '14px', 
                background: '#fff', 
                color: '#000', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
              }}
            >
              {checkingName ? 'Reserving...' : 'Claim Canvas'}
            </button>
          </form>
          {status && (
            <div style={{ marginTop: '1.5rem', padding: '10px 12px', background: '#111', border: '1px solid #222', borderRadius: '6px' }}>
              <p style={{ margin: 0, color: '#00ffcc', fontSize: '0.85rem', fontFamily: 'monospace' }}>{status}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ULTRA-POLISHED PREMIUM WORKSPACE INTERFACE
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      background: '#080808', 
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      
      {/* TOP CONTROL BAR */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 1.5rem', 
        height: '64px', 
        background: '#0d0d0d', 
        borderBottom: '1px solid #1a1a1a' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></span>
          </div>
          <div style={{ height: '16px', width: '1px', background: '#222' }}></div>
          <div>
            <span style={{ color: '#666', fontSize: '0.85rem', fontWeight: '500' }}>WORKSPACE /</span>
            <strong style={{ color: '#fff', fontSize: '0.85rem', marginLeft: '4px', letterSpacing: '0.5px' }}>@{username}</strong>
          </div>
        </div>

        {/* STATUS BAR INDICATION */}
        {status && (
          <div style={{ fontSize: '0.85rem', color: '#a855f7', fontFamily: 'monospace', background: 'rgba(168,85,247,0.05)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(168,85,247,0.15)' }}>
            {status}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={saveProfileChanges}
            style={{ 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              padding: '8px 18px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '0.85rem',
              boxShadow: '0 4px 12px rgba(255,255,255,0.05)'
            }}
          >
            Commit Changes
          </button>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ 
              background: 'transparent', 
              color: '#ff4444', 
              border: '1px solid rgba(255, 68, 68, 0.2)', 
              padding: '7px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            Disconnect
          </button>
        </div>
      </header>

      {/* SPLIT SCREEN MAIN VIEW */}
      <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT PANEL: The Code Sandbox Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0a', borderRight: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '36px', background: '#0e0e0e', padding: '0 1rem', borderBottom: '1px solid #141414' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#555', letterSpacing: '1px', fontFamily: 'monospace' }}>SOURCE.HTML</span>
          </div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            style={{ 
              flex: 1,
              width: '100%', 
              background: '#0a0a0a', 
              color: '#a6e22e', 
              border: 'none', 
              padding: '1.5rem', 
              fontFamily: 'Courier New, monospace', 
              fontSize: '0.95rem',
              lineHeight: '1.6',
              outline: 'none', 
              resize: 'none',
              tabSize: 2
            }}
          />
        </div>

        {/* RIGHT PANEL: Safe Live Preview Frame */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#111' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '36px', background: '#0e0e0e', padding: '0 1rem', borderBottom: '1px solid #141414' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#555', letterSpacing: '1px', fontFamily: 'monospace' }}>LIVE_NETWORK_PREVIEW</span>
            <span style={{ fontSize: '0.75rem', color: '#444', fontFamily: 'monospace' }}>yourdomain.com/u/{username}</span>
          </div>
          <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
            <iframe 
              srcDoc={code}
              title="Grid Live Preview"
              sandbox="allow-popups" // Allows normal styles and layouts, but drops JS manipulation capabilities out of preview pane natively
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#fff'
              }}
            />
          </div>
        </div>

      </main>
    </div>
  );
}
