import DOMPurify from 'isomorphic-dompurify';

export default async function UserProfile({ params }) {
  // Direct unpack of parameters
  const { username } = await params;
  
  const owner = process.env.GITHUB_DB_OWNER;
  const repo = process.env.GITHUB_DB_REPO;
  const cleanName = username.toLowerCase().trim();

  // The direct web URL pointing straight to your profiles folder file
  const githubRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/profiles/${cleanName}.html`;

  let rawHTML = '';
  try {
    // cache: 'no-store' forces Vercel to look at your repo immediately instead of caching the old 404
    const res = await fetch(githubRawUrl, { cache: 'no-store' });
    
    if (res.ok) {
      rawHTML = await res.text();
    } else {
      rawHTML = `
        <div style="text-align:center; padding: 100px 20px; font-family:system-ui, sans-serif; background:#000; color:#fff; min-height:100vh; box-sizing:border-box;">
          <h1 style="font-size:3rem; margin:0 0 10px 0;">404</h1>
          <p style="color:#666; margin:0 0 20px 0;">Profile for <strong>@${username}</strong> not found on the database.</p>
          <p style="font-size:0.8rem; color:#333; font-family:monospace;">Target: ${githubRawUrl}</p>
        </div>
      `;
    }
  } catch (error) {
    rawHTML = `
      <div style="text-align:center; padding: 100px 20px; font-family:system-ui, sans-serif; background:#000; color:#fff; min-height:100vh; box-sizing:border-box;">
        <p style="color:#ff4444;">Database connection error.</p>
      </div>
    `;
  }

  // Scrub any active script injections but leave custom styles intact
  const cleanProfileHTML = DOMPurify.sanitize(rawHTML, {
    FORCE_BODY: true, 
    ADD_TAGS: ['style', 'marquee', 'center'], 
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <div dangerouslySetInnerHTML={{ __html: cleanProfileHTML }} />
    </div>
  );
}
