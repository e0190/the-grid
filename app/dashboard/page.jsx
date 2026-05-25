'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [code, setCode] = useState('<style>\n  body { background: #111; color: lime; font-family: monospace; }\n</style>\n\n<h1>My Custom Zone</h1>\n<p>Welcome to my corner of the grid.</p>');
  const [status, setStatus] = useState('');
  const [checkingName, setCheckingName] = useState(false);

  // Read saved username locally if they've already completed onboarding
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
    setStatus('Checking availability...');

    const res = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (data.available) {
      setStatus('Username available! Creating your canvas...');
      // Initialize the repository file with default boilerplate code
      const createRes = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, htmlContent: code })
      });

      if (createRes.ok) {
        localStorage.setItem('grid_username', username);
        setIsRegistered(true);
        setStatus(`Username @${username} successfully claimed!`);
      } else {
        setStatus('Error locking username. Try again.');
      }
    } else {
      setStatus('That username is already taken. Try another.');
    }
    setCheckingName(false);
  };

  const saveProfileChanges = async () => {
    setStatus('Pushing updates to GitHub...');
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, htmlContent: code })
    });
    
    if (res.ok) {
      setStatus(`Saved successfully! View live at /u/${username}`);
    } else {
      const errorMsg = await res.text();
      setStatus(`Error: ${errorMsg}`);
    }
  };

  // STEP 1: Onboarding Flow (Choose Username)
  if (!isRegistered) {
    return (
      <div style={{ maxWidth: '450px', margin: '15vh auto', padding: '2rem', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontFamily: 'sans-serif' }}>
        <h1 style={{ marginTop: 0 }}>Claim Your Identity</h1>
        <p style={{ color: '#aaa' }}>Choose a completely unique username. This will lock your URL permanently on the network.</p>
        
        <form onSubmit={handleClaimUsername} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#222', border: '1px solid #444', borderRadius: '4px', paddingLeft: '10px' }}>
            <span style={{ color: '#666', fontWeight: 'bold' }}>thegrid.com/u/</span>
            <input 
              type="text" 
              placeholder="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
              required
              disabled={checkingName}
              style={{ width: '100%', padding: '12px 10px', background: 'transparent', color: '#fff', border: 'none', outline: 'none' }}
            />
          </div>
          <button type="submit" disabled={checkingName} style={{ padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {checkingName ? 'Securing name...' : 'Claim Username'}
          </button>
        </form>
        {status && <p style={{ marginTop: '1rem', color: '#0ff', fontSize: '0.9rem' }}>{status}</p>}
      </div>
    );
  }

  // STEP 2: The Core Code Editor Interface
  return (
    <div style={{ maxWidth: '800px', margin: '5vh auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Editing: @{username}</h1>
          <p style={{ color: '#aaa', margin: '5px 0 0 0' }}>Your profile URL is active at <strong>/u/{username}</strong></p>
        </div>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Change Account
        </button>
      </div>
      
      <textarea 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: '100%', height: '400px', background: '#111', color: '#0f0', border: '1px solid #333', padding: '1rem', fontFamily: 'monospace', marginBottom: '1rem', borderRadius: '4px', outline: 'none' }}
      />
      
      <button 
        onClick={saveProfileChanges}
        style={{ padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Commit to Network
      </button>

      {status && <p style={{ marginTop: '1rem', color: '#0ff' }}>{status}</p>}
    </div>
  );
}
