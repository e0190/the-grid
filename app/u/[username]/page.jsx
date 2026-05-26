import fs from 'fs';
import path from 'path';

export default async function UserProfile({ params }) {
  const resolvedParams = await params;
  const username = resolvedParams?.username;
  
  if (!username) {
    return (
      <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
        <p>Error: No username provided.</p>
      </div>
    );
  }

  const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
  const filePath = path.join(process.cwd(), 'profiles', `${cleanName}.html`);

  let rawHTML = '';

  // Check if the file exists in the project folder
  if (fs.existsSync(filePath)) {
    rawHTML = fs.readFileSync(filePath, 'utf-8');
  } else {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>404</h1>
        <p style={{ color: '#666', margin: '0 0 20px 0' }}>The profile for <strong>@${username}</strong> does not exist.</p>
      </div>
    );
  }

  // Strip out the internal tracking comment before rendering
  const cleanHTML = rawHTML.replace(//g, '');

  if (!cleanHTML || cleanHTML.trim().length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh' }}>
        <p style={{ color: '#666' }}>This profile exists, but it has no content.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
    </div>
  );
}
