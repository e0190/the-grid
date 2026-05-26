import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';

// Helper to get the absolute path to the profiles folder
const getProfileFilePath = (username) => {
  const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
  return path.join(process.cwd(), 'profiles', `${cleanName}.html`);
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  if (!username) return new Response('Missing username', { status: 400 });

  const filePath = getProfileFilePath(username);

  // Check if file exists locally on the server disk
  if (fs.existsSync(filePath)) {
    return new Response(JSON.stringify({ available: false }), { status: 200 });
  }
  return new Response(JSON.stringify({ available: true }), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { username, htmlContent } = await req.json();
  if (!username) return new Response('Username required', { status: 400 });

  const filePath = getProfileFilePath(username);
  const dirPath = path.dirname(filePath);

  // Ensure the profiles directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const trackingComment = `\n`;

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (!fileContent.includes(``)) {
      return new Response('This username belongs to someone else.', { status: 403 });
    }
  }

  // Write the file directly to the local disk
  fs.writeFileSync(filePath, trackingComment + htmlContent, 'utf-8');
  return new Response(JSON.stringify({ success: true, username }), { status: 200 });
}
