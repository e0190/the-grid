'use client';
import { useState, useEffect } from 'react';

// Built-In Premium Templates
const TEMPLATES = {
  cyberpunk: `<style>
  body {
    background-color: #030308;
    color: #00ffcc;
    font-family: 'Courier New', monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
  }
  .box {
    border: 2px solid #ff0055;
    padding: 30px;
    background: rgba(255, 0, 85, 0.03);
    box-shadow: 0 0 20px #ff0055, inset 0 0 10px #ff0055;
    border-radius: 4px;
    max-width: 400px;
    text-align: center;
  }
  h1 { text-transform: uppercase; color: #fff; text-shadow: 0 0 10px #00ffcc; }
</style>
<div class="box">
  <h1>Sector Secured</h1>
  <p>Welcome to my underground terminal. Built with raw variables and compiled live through the grid matrix.</p>
</div>`,

  terminal: `<style>
  body {
    background: #000;
    color: #33ff33;
    font-family: monospace;
    padding: 40px;
    margin: 0;
  }
  .cursor {
    display: inline-block;
    width: 10px;
    height: 18px;
    background: #33ff33;
    animation: blink 1s infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
</style>
<h2>root@thegrid:~# cat profile.txt</h2>
<p>Name: User Node 7892<br>Status: Online<br>Bio: Building the future through open code structures.</p>
<h2>root@thegrid:~# <span class="cursor"></span></h2>`,

  minimalist: `<style>
  body {
    background: #fdfdfd;
    color: #111;
    font-family: system-ui, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
  }
  .wrapper { max-width: 500px; padding: 20px; }
  h1 { font-weight: 300; letter-spacing: -1px; font-size: 2.5rem; margin-bottom: 5px; }
  hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
  p { color: #666; line-height: 1.6; }
</style>
<div class="wrapper">
  <h1>A Clean Canvas.</h1>
  <p>Design doesn't need to be loud to make an impact. This profile represents a quiet corner on a busy web.</p>
  <hr />
</div>`
};

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // code | visual
  const [code, setCode] = useState(TEMPLATES.cyberpunk);
  const [status, setStatus] = useState('');
  const [checkingName, setCheckingName] = useState(false);

  // Drag and drop canvas state components
  const [canvasBlocks, setCanvasBlocks] = useState([
    { id: '1', type: 'heading', content: 'My Visual Site' },
    { id: '2', type: 'paragraph', content: 'Drag blocks from the tray or edit text live right inside the field.' }
  ]);

  useEffect(() => {
    const savedName = localStorage.getItem('grid_username');
    if (savedName) {
      setUsername(savedName);
      setIsRegistered(true);
    }
  }, []);

  // Sync Drag & Drop state into clean raw HTML structure dynamically
  useEffect(() => {
    if (activeTab === 'visual') {
      const generatedHTML = `<style>
  body {
    background-color: #0b0b0f;
    color: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .canvas-container { max-width: 600px; width: 100%; text-align: center; }
  h1 { font-size: 2.5rem; color: #fff; margin-bottom: 15px; font-weight: 800; letter-spacing: -0.5px; }
  p { color: #888899; font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px; }
  .btn-link { display: inline-block; background: #fff; color: #000; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; }
</style>
<div class="canvas-container">
  ${canvasBlocks.map(b => {
    if (b.type === 'heading') return `<h1>${b.content}</h1>`;
    if (b.type === 'paragraph') return `<p>${b.content}</p>`;
    if (b.type === 'button') return `<a href="#" class="btn-link">${b.content}</a>`;
    return '';
  }).join('\n  ')}
</div>`;
      setCode(generatedHTML);
    }
  }, [canvasBlocks, activeTab]);

  const applyTemplate = (key) => {
    if (confirm('Loading this template will replace your current code workspace. Proceed?')) {
      setCode(TEMPLATES[key]);
    }
  };

  const handleClaimUsername = async (e) => {
    e.preventDefault();
    if (!username || username.length < 3) return;
    setCheckingName(true);
    setStatus('Reserving grid channel...');

    const res = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (data.available) {
      const createRes = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, htmlContent: code })
      });

      if (createRes.ok) {
        localStorage.setItem('grid_username', username);
        setIsRegistered(true);
        setStatus(`Authenticated channels: @${username}`);
      }
    } else {
      setStatus('Channel occupied. Try another handle.');
    }
    setCheckingName(false);
  };

  const saveProfileChanges = async () => {
    setStatus('Pushing build payload to database...');
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, htmlContent: code })
    });
    if (res.ok) {
      setStatus('Deployed successfully to core servers.');
      setTimeout(() => setStatus(''), 4000);
    }
  };

  const addVisualBlock = (type) => {
    const defaultText = type === 'heading' ? 'New Header' : type === 'paragraph' ? 'Click text inline to edit content.' : 'Action Button';
    setCanvasBlocks([...canvasBlocks, { id: Date.now().toString(), type, content: defaultText }]);
  };

  const updateBlockContent = (id, text) => {
    setCanvasBlocks(canvasBlocks.map(b => b.id === id ? { ...b, content: text } : b));
  };

  const moveBlock = (index, direction) => {
    const nextBlocks = [...canvasBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextBlocks.length) return;
    const temp = nextBlocks[index];
    nextBlocks[index] = nextBlocks[targetIndex];
    nextBlocks[targetIndex] = temp;
    setCanvasBlocks(nextBlocks);
  };

  const removeBlock = (id) => {
    setCanvasBlocks(canvasBlocks.filter(b => b.id !== id));
  };

  if (!isRegistered) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', backgroundColor: '#0a0a0c', border: '1px solid #1c1c24', borderRadius: '16px' }}>
          <h1 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 8px 0' }}>Assign Username</h1>
          <p style={{ color: '#555', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>Allocate your public path parameters.</p>
          <form onSubmit={handleClaimUsername} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase())}
              required
              style={{ padding: '14px', background: '#121216', color: '#fff', border: '1px solid #222530', borderRadius: '8px', outline: 'none' }}
            />
            <button type="submit" disabled={checkingName} style={{ padding: '14px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Claim Workspace
            </button>
          </form>
          {status && <p style={{ color: '#a855f7', fontSize: '0.8rem', marginTop: '10px', fontFamily: 'monospace' }}>{status}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#050508', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* GLOBAL WORKSPACE HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', height: '64px', background: '#09090d', borderBottom: '1px solid #14141f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.5px' }}>THE GRID / @{username}</span>
          <div style={{ display: 'flex', background: '#111116', padding: '3px', borderRadius: '6px', border: '1px solid #1c1c24' }}>
            <button onClick={() => setActiveTab('code')} style={{ padding: '6px 12px', background: activeTab === 'code' ? '#1c1c24' : 'transparent', color: activeTab === 'code' ? '#fff' : '#666', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Code Canvas</button>
            <button onClick={() => setActiveTab('visual')} style={{ padding: '6px 12px', background: activeTab === 'visual' ? '#1c1c24' : 'transparent', color: activeTab === 'visual' ? '#fff' : '#666', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Visual Builder (Drag & Drop)</button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {status && <span style={{ color: '#00ffcc', fontSize: '0.8rem', fontFamily: 'monospace' }}>{status}</span>}
          <button onClick={saveProfileChanges} style={{ background: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Deploy Profile</button>
        </div>
      </header>

      {/* CORE BUILDER DIVISION WORKSPACE */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT COLUMN COMPONENT CHANGED BY TAB STATE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#09090c', borderRight: '1px solid #14141f' }}>
          
          {activeTab === 'code' ? (
            /* MODE A: RAW MARKUP CODE CONSOLE */
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#0e0e14', borderBottom: '1px solid #14141f' }}>
                <span style={{ fontSize: '0.7rem', color: '#555', fontWeight: '700', marginRight: '10px' }}>STARTER TEMPLATES:</span>
                <button onClick={() => applyTemplate('cyberpunk')} style={{ padding: '4px 8px', background: '#14141f', border: '1px solid #222230', color: '#aaa', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Cyberpunk</button>
                <button onClick={() => applyTemplate('terminal')} style={{ padding: '4px 8px', background: '#14141f', border: '1px solid #222230', color: '#aaa', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Terminal</button>
                <button onClick={() => applyTemplate('minimalist')} style={{ padding: '4px 8px', background: '#14141f', border: '1px solid #222230', color: '#aaa', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Minimalist</button>
              </div>
              <textarea 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                style={{ flex: 1, width: '100%', background: '#060608', color: '#a6e22e', padding: '20px', fontFamily: 'monospace', fontSize: '0.9rem', border: 'none', outline: 'none', resize: 'none' }}
              />
            </div>
          ) : (
            /* MODE B: SEPARATE DRAG & DROP INTERACTIVE VISUAL MAKER */
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', gap: '10px', padding: '12px 20px', background: '#0e0e14', borderBottom: '1px solid #14141f' }}>
                <button onClick={() => addVisualBlock('heading')} style={{ padding: '8px 14px', background: '#1c1c24', color: '#fff', border: '1px solid #2d2d3d', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>+ Add Heading</button>
                <button onClick={() => addVisualBlock('paragraph')} style={{ padding: '8px 14px', background: '#1c1c24', color: '#fff', border: '1px solid #2d2d3d', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>+ Add Paragraph</button>
                <button onClick={() => addVisualBlock('button')} style={{ padding: '8px 14px', background: '#1c1c24', color: '#fff', border: '1px solid #2d2d3d', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>+ Add Button</button>
              </div>
              
              <div style={{ flex: 1, padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {canvasBlocks.map((block, idx) => (
                  <div key={block.id} style={{ display: 'flex', alignItems: 'center', background: '#111116', border: '1px solid #1c1c24', padding: '12px 16px', borderRadius: '8px', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button onClick={() => moveBlock(idx, 'up')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: 0 }}>▲</button>
                      <button onClick={() => moveBlock(idx, 'down')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: 0 }}>▼</button>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.65rem', color: '#555', display: 'block', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>{block.type} BLOCK</span>
                      <input 
                        type="text" 
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px dashed #222', color: '#fff', fontSize: '0.95rem', padding: '4px 0', outline: 'none' }}
                      />
                    </div>

                    <button onClick={() => removeBlock(block.id)} style={{ background: 'transparent', color: '#ff4444', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: COMPILED RENDER OUTPUT VIEW */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
          <iframe 
            srcDoc={code}
            title="Grid Live Pipeline Compile"
            sandbox="allow-popups"
            style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
          />
        </div>

      </div>
    </div>
  );
}
