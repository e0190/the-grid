'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useParams } from 'next/navigation';

export default function DynamicUserHub() {
  const { data: session, status: sessionStatus } = useSession();
  const params = useParams();
  
  const slug = params?.slug || [];
  const username = slug[0] || '';
  const subPage = slug.slice(1).join('/');

  const [pageState, setPageState] = useState('loading'); 
  const [code, setCode] = useState('<h1>My Profile</h1>');
  const [statusText, setStatusText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStatus === 'loading' || !username) return;

    async function loadGridSpace() {
      try {
        const targetPath = subPage ? `${username}/${subPage}` : username;
        const res = await fetch(`/api/profile?path=${encodeURIComponent(targetPath)}`);
        const data = await res.json();

        if (data.exists) {
          setCode(data.htmlContent);
          if (session && data.ownerEmail === session.user.email) {
            setPageState('editor');
          } else {
            setPageState('viewer');
          }
        } else {
          if (session && !subPage) {
            const userCheck = await fetch(`/api/profile?path=${encodeURIComponent(username)}`);
            const userData = await userCheck.json();
            if (userData.exists && userData.ownerEmail !== session.user.email) {
              setPageState('404'); 
            } else {
              setPageState('create');
            }
          } else if (session && subPage) {
            const rootCheck = await fetch(`/api/profile?path=${encodeURIComponent(username)}`);
            const rootData = await rootCheck.json();
            if (rootData.exists && rootData.ownerEmail === session.user.email) {
               setPageState('create'); 
            } else {
               setPageState('404');
            }
          } else {
            setPageState('404');
          }
        }
      } catch (err) {
        setPageState('404');
      }
    }

    loadGridSpace();
  }, [username, subPage, session, sessionStatus]);

  const handleInitializeSite = async () => {
    setLoading(true);
    setStatusText('Claiming domain path...');
    const targetPath = subPage ? `${username}/${subPage}` : username;

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: targetPath, htmlContent: code })
    });

    if (res.ok) {
      setPageState('editor');
      setStatusText('');
    } else {
      setStatusText('Route registration failed.');
    }
    setLoading(false);
  };

  const handlePublishChanges = async () => {
    setStatusText('Publishing code commit...');
    const targetPath = subPage ? `${username}/${subPage}` : username;

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: targetPath, htmlContent: code })
    });

    if (res.ok) {
      setStatusText('Saved progress successfully.');
      setTimeout(() => setStatusText(''), 3000);
    } else {
      setStatusText('Error pushing code.');
    }
  };

  if (pageState === 'loading') {
    return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading node...</div>;
  }

  if (pageState === '404') {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>Uh Oh...</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '400', margin: '0 0 10px 0', color: '#aaa' }}>error 404</h2>
        <p style={{ color: '#666', margin: '0' }}>Site not found or doesn't exist.</p>
      </div>
    );
  }

  if (pageState === 'create') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '360px', width: '100%', padding: '30px', backgroundColor: '#121212', border: '1px solid #222', borderRadius: '8px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 8px 0' }}>Claim @{username}{subPage ? `/${subPage}` : ''}</h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 20px 0' }}>Click below to initialize this specific page layout on the network.</p>
          <button onClick={handleInitializeSite} disabled={loading} style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            {loading ? 'Initializing...' : 'Create Site'}
          </button>
          {statusText && <p style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '12px' }}>{statusText}</p>}
        </div>
      </div>
    );
  }

  if (pageState === 'editor') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0a0a0a' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: '56px', borderBottom: '1px solid #222', background: '#121212' }}>
          <div style={{ fontSize: '0.9rem' }}>
            <span style={{ color: '#666' }}>Workspace:</span> <strong style={{ color: '#fff' }}>@{username}{subPage ? `/${subPage}` : ''}</strong>
          </div>
          {statusText && <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{statusText}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePublishChanges} style={{ background: '#fff', color: '#000', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
              Publish
            </button>
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #333', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Log Out
            </button>
          </div>
        </header>

        <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              style={{ flex: 1, width: '100%', background: '#0a0a0a', color: '#fff', border: 'none', padding: '20px', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.5', outline: 'none', resize: 'none' }}
            />
          </div>
          <div style={{ flex: 1, borderLeft: '1px solid #222', background: '#fff' }}>
            <iframe srcDoc={code} title="Preview" sandbox="allow-popups" style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
}
