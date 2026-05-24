import { Octokit } from '@octokit/rest';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { htmlContent } = await req.json();
  const username = session.user.name.replace(/\s+/g, '').toLowerCase(); 
  
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  const owner = process.env.GITHUB_DB_OWNER;
  const repo = process.env.GITHUB_DB_REPO;
  const path = `profiles/${username}.html`;

  try {
    let sha;
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path });
      sha = data.sha;
    } catch (e) {}

    await octokit.repos.createOrUpdateFileContents({
      owner, 
      repo, 
      path,
      message: `Grid Update: Profile saved for ${username}`,
      content: Buffer.from(htmlContent).toString('base64'),
      sha
    });

    return new Response(JSON.stringify({ success: true, username }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
