import { Octokit } from '@octokit/rest';
import { getServerSession } from 'next-auth';

// Helper to create a standardized file path
const getProfilePath = (username) => {
  const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
  return `profiles/${cleanName}.html`;
};

// GET: Checks if a username is available
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  if (!username) return new Response('Missing username', { status: 400 });

  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  
  try {
    // Attempt to fetch the file from GitHub
    await octokit.repos.getContent({
      owner: process.env.GITHUB_DB_OWNER,
      repo: process.env.GITHUB_DB_REPO,
      path: getProfilePath(username),
    });
    // If it succeeds without throwing an error, the file exists (username taken)
    return new Response(JSON.stringify({ available: false }), { status: 200 });
  } catch (error) {
    if (error.status === 404) {
      // File not found means the username is completely free!
      return new Response(JSON.stringify({ available: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
}

// POST: Saves or creates the user's custom HTML profile
export async function POST(req) {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { username, htmlContent } = await req.json();
  if (!username) return new Response('Username required', { status: 400 });

  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  const owner = process.env.GITHUB_DB_OWNER;
  const repo = process.env.GITHUB_DB_REPO;
  const path = getProfilePath(username);

  try {
    let sha;
    let metadata = { email: session.user.email };

    try {
      // Check if file exists to update it and verify ownership
      const { data } = await octokit.repos.getContent({ owner, repo, path });
      sha = data.sha;
      
      // Decode the file to check if the logged-in email matches the creator's email
      const fileContent = Buffer.from(data.content, 'base64').toString('utf-8');
      if (!fileContent.includes(``)) {
        return new Response('This username belongs to someone else.', { status: 403 });
      }
    } catch (e) {
      // File doesn't exist, meaning this is a brand new username registration.
      // Double check availability one last time right before committing
      try {
        const checkRes = await octokit.repos.getContent({ owner, repo, path });
        if (checkRes.data) return new Response('Username locked by another process', { status: 400 });
      } catch (err) {}
    }

    // Embed the user's email secretly as an HTML comment at the top for ownership verification
    const finalStoredContent = `\n${htmlContent}`;

    await octokit.repos.createOrUpdateFileContents({
      owner, 
      repo, 
      path,
      message: `Grid Update: Profile committed for @${username}`,
      content: Buffer.from(finalStoredContent).toString('base64'),
      sha
    });

    return new Response(JSON.stringify({ success: true, username }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
