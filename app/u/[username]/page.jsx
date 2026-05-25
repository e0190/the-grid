export default async function UserProfile({ params }) {
  const resolvedParams = await params;
  const username = resolvedParams?.username || 'no-username-found';
  
  const owner = process.env.GITHUB_DB_OWNER || 'missing-owner-env';
  const repo = process.env.GITHUB_DB_REPO || 'missing-repo-env';
  const pat = process.env.GITHUB_PAT ? 'present' : 'missing-pat-env';
  
  const githubRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/profiles/${username.toLowerCase().trim()}.html`;

  let debugStatus = 'Not started';
  let fileContent = '';

  try {
    const res = await fetch(githubRawUrl, { cache: 'no-store' });
    debugStatus = `Fetch status code: ${res.status} (${res.statusText})`;
    if (res.ok) {
      fileContent = await res.text();
    }
  } catch (error) {
    debugStatus = `Fetch crashed. Error message: ${error.message}`;
  }

  return (
    <div style={{ background: '#111', color: '#fff', padding: '40px', fontFamily: 'monospace', minHeight: '100vh', lineHieght: '1.6' }}>
      <h1 style={{ color: '#ff4444', borderBottom: '1px solid #333', paddingBottom: '10px' }}>System Diagnostics</h1>
      
      <p><strong>Requested Username:</strong> {username}</p>
      <p><strong>Database Owner:</strong> {owner}</p>
      <p><strong>Database Repo:</strong> {repo}</p>
      <p><strong>GitHub Token (PAT):</strong> {pat}</p>
      <p><strong>Target URL:</strong> <a href={githubRawUrl} style={{ color: '#00ffcc' }} target="_blank">{githubRawUrl}</a></p>
      
      <hr style={{ border: 'none', height: '1px', background: '#333', margin: '20px 0' }} />
      
      <p><strong>Network Fetch Result:</strong> {debugStatus}</p>
      
      <hr style={{ border: 'none', height: '1px', background: '#333', margin: '20px 0' }} />
      
      <p><strong>Raw Downloaded Content:</strong></p>
      <pre style={{ background: '#000', padding: '20px', border: '1px solid #222', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
        {fileContent || '[ No text content was returned from the file ]'}
      </pre>
    </div>
  );
}
