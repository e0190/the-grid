export default async function UserProfile({ params }) {
  // Await params safely to support all modern Next.js versions
  const resolvedParams = await params;
  const username = resolvedParams?.username;
  
  if (!username) {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
        <p>Error: No username provided in the URL route.</p>
      </div>
    );
  }

  const owner = process.env.GITHUB_DB_OWNER;
  const repo = process.env.GITHUB_DB_REPO;
  const cleanName = username.toLowerCase().trim();

  // URL pointing directly to the raw text inside your database repository
  const githubRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/profiles/${cleanName}.html`;

  let rawHTML = '';
  try {
    // cache: 'no-store' tells Vercel to fetch fresh data on every single page view
    const res = await fetch(githubRawUrl, { cache: 'no-store' });
    
    if (res.ok) {
      rawHTML = await res.text();
    } else {
      return (
        <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>404</h1>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>The profile for <strong>@${username}</strong> does not exist.</p>
          <p style={{ fontSize: '0.8rem', color: '#222', fontFamily: 'monospace' }}>Looking for: profiles/${cleanName}.html</p>
        </div>
      );
    }
  } catch (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh' }}>
        <p style={{ color: '#ff4444' }}>Failed to connect to the GitHub database repository.</p>
      </div>
    );
  }

  // If the file downloaded but contains absolutely nothing, show a message
  if (!rawHTML || rawHTML.trim().length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh' }}>
        <p style={{ color: '#666' }}>This profile exists, but it has no layout content inside it yet.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <div dangerouslySetInnerHTML={{ __html: rawHTML }} />
    </div>
  );
}
