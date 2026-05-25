'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [code, setCode] = useState('<h1>Hello World</h1>\n<p>Welcome to my profile page.</p>');
  const [statusText, setStatusText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('grid_username');
    if (savedName) {
      setUsername(savedName);
      setIsRegistered(true);
    }
  }, []);

  if (sessionStatus === "loading") {
    return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (sessionStatus === "unauthenticated") {
    return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Access Denied. Please log in.</div>;
  }

  const handleClaimUsername = async (e) => {
    e.preventDefault();
    if (!username || username.length < 3) {
      alert('Username must be at least 3 characters.');
      return;
    }
    
    setLoading(true);
    setStatusText('Checking username...');

    const res = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (data.available) {
      setStatusText('Saving username...');
      const createRes = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, htmlContent: code })
      });

      if (createRes.ok) {
        localStorage.setItem('grid_username', username);
        setIsRegistered(true);
        setStatusText('');
      } else {
        setStatusText('Failed to save username.');
      }
    } else {
      setStatusText('Username is already taken.');
    }
    setLoading(false);
  };

  const saveProfileChanges = async () => {
    setStatusText('Saving to GitHub...');
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, htmlContent: code })
    });
    
    if (res.ok) {
      setStatusText('Saved successfully.');
      setTimeout(() => setStatusText(''), 3000);
    } else {
      setStatusText('Error saving changes.');
    }
  };

  // Username Selection Screen
  if (!isRegistered) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '360px', width: '100%', padding: '30px', backgroundColor: '#121212', border: '1px solid #222', borderRadius: '8px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 8px 0' }}>Choose a username</h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 20px 0' }}>This will be your permanent profile web address.</p>
          
          <form onSubmit={handleClaimUsername} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', paddingLeft: '12px' }}>
              <span style={{ color: '#444', fontSize: '0.95rem' }}>/u/</span>
              <input 
                type="text" 
                placeholder="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase())}
                required
                disabled={loading}
                style={{ width: '100%', padding: '12px 8px', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
          {statusText && <p style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '12px' }}>{statusText}</p>}
        </div>
      </div>
    );
  }

  // Split-Screen Code Workspace
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0a0a0a' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: '56px', borderBottom: '1px solid #222', background: '#121212' }}>
        <div style={{ fontSize: '0.9rem' }}>
          <span style={{ color: '#666' }}>Editing:</span> <strong style={{ color: '#fff' }}>@{username}</strong>
        </div>
        
        {statusText && <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{statusText}</div>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={saveProfileChanges} style={{ background: '#fff', color: '#000', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
            Save Changes
          </button>
          <button onClick={() => { localStorage.clear(); signOut({ callbackUrl: '/' }); }} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #333', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
            Log Out
          </button>
        </div>
      </header>

      <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            style={{ flex: 1, width: '100%', background: '#0a0a0a', color: '#fff', border: 'none', padding: '20px', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.5', outline: 'none', resize: 'none' }}
          />
        </div>

        {/* Live Preview */}
        <div style={{ flex: 1, borderLeft: '1px solid #222', background: '#fff' }}>
          <iframe srcDoc={code} title="Preview" sandbox="allow-popups" style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }} />
        </div>
      </main>
    </div>
  );
}
