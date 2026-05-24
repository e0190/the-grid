'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [code, setCode] = useState('<style>\n  body { background: #111; color: lime; font-family: monospace; }\n</style>\n\n<h1>My Custom Zone</h1>\n<p>Welcome to my corner of the grid.</p>');
  const [status, setStatus] = useState('');

  const saveProfile = async () => {
    setStatus('Saving to GitHub...');
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ htmlContent: code })
    });
    
    if (res.ok) {
      const data = await res.json();
      setStatus(`Saved! Check out /u/${data.username}`);
    } else {
      setStatus('Error saving. Check console.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '5vh auto', padding: '2rem' }}>
      <h1>Profile Editor</h1>
      <p style={{ color: '#aaa' }}>Write your pure HTML/CSS here. JavaScript will be automatically nuked on render.</p>
      
      <textarea 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: '100%', height: '400px', background: '#111', color: '#0f0', border: '1px solid #333', padding: '1rem', fontFamily: 'monospace', marginBottom: '1rem' }}
      />
      
      <button 
        onClick={saveProfile}
        style={{ padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Commit to Network
      </button>

      {status && <p style={{ marginTop: '1rem', color: '#0ff' }}>{status}</p>}
    </div>
  );
}
