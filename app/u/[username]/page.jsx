import DOMPurify from 'isomorphic-dompurify';

export default async function UserProfile({ params }) {
  const { username } = params;
  
  const githubRawUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_DB_OWNER}/${process.env.GITHUB_DB_REPO}/main/profiles/${username}.html`;

  let rawHTML = '';
  try {
    const res = await fetch(githubRawUrl, { next: { revalidate: 30 } });
    if (res.ok) {
      rawHTML = await res.text();
    } else {
      rawHTML = `<div style="text-align:center; padding: 50px; font-family:sans-serif;"><h1>404</h1><p>Profile not found on the Grid.</p></div>`;
    }
  } catch (error) {
    rawHTML = `<p style="font-family:sans-serif; text-align:center; padding:50px;">Error connecting to the Grid.</p>`;
  }

  const cleanProfileHTML = DOMPurify.sanitize(rawHTML, {
    FORCE_BODY: true, 
    ADD_TAGS: ['style', 'marquee', 'center'], 
  });

  return (
    <div style={{ minHeight: '100vh' }}>
      <div dangerouslySetInnerHTML={{ __html: cleanProfileHTML }} />
    </div>
  );
}
