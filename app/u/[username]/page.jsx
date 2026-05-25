import DOMPurify from 'isomorphic-dompurify';

export default async function UserProfile({ params }) {
  // Fix 1: Properly await the asynchronous route parameters
  const resolvedParams = await params;
  const username = resolvedParams?.username;
  
  if (!username) {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
        <p>Invalid account route parameter.</p>
      </div>
    );
  }

  const owner = process.env.GITHUB_DB_OWNER;
  const repo = process.env.GITHUB_DB_REPO;
  const cleanName = username.toLowerCase().trim();

  // Direct raw source URL mapping
  const githubRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/profiles/${cleanName}.html`;

  let rawHTML = '';
  try {
    const res = await fetch(githubRawUrl, { cache: 'no-store' });
    
    if (res.ok) {
      rawHTML = await res.text();
    } else {
      // If the file is physically missing, display a clean status layout
      return (
        <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>404</h1>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>Profile for <strong>@${username}</strong> not found.</p>
          <p style={{ fontSize: '0.8rem', color: '#222', fontFamily: 'monospace' }}>Path: profiles/${cleanName}.html</p>
        </div>
      );
    }
  } catch (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh' }}>
        <p style={{ color: '#ff4444' }}>Database target connection timeout.</p>
      </div>
    );
  }

  // Fix 2: Wrap execution safely to handle pure text fallback if sanitization acts up
  let cleanProfileHTML = '';
  try {
    cleanProfileHTML = DOMPurify.sanitize(rawHTML, {
      FORCE_BODY: true, 
      ADD_TAGS: ['style', 'marquee', 'center'], 
    });
  } catch (e) {
    cleanProfileHTML = rawHTML;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <div dangerouslySetInnerHTML={{ __html: cleanProfileHTML }} />
    </div>
  );
}
