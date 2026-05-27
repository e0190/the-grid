import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';

// Secures the path to prevent directory traversal hacks
const resolveStoragePath = (targetPath) => {
  const scrubbedPath = targetPath.toLowerCase().replace(/[^a-z0-9_\-\/]/g, '').replace(/\.\./g, '').trim();
  return path.join(process.cwd(), 'app', 'u', 'user-sites', `${scrubbedPath}.html`);
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetPath = searchParams.get('path');
  if (!targetPath) return new Response('Missing target lookup path', { status: 400 });

  const filePath = resolveStoragePath(targetPath);

  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const match = fileContent.match(//);
      const ownerEmail = match ? match[1] : null;
      const htmlContent = fileContent.replace(//g, '');

      return new Response(JSON.stringify({ exists: true, ownerEmail, htmlContent }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Disk read fault' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ exists: false }), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession();
  if (!session || !session.user?.email) return new Response('Unauthorized', { status: 401 });

  const { path: targetPath, htmlContent } = await req.json();
  if (!targetPath) return new Response('Target route path required', { status: 400 });

  const filePath = resolveStoragePath(targetPath);
  const dirPath = path.dirname(filePath);

  // Validate ownership of the root namespace
  const baseUsername = targetPath.split('/')[0];
  const rootUserFile = resolveStoragePath(baseUsername);

  if (fs.existsSync(rootUserFile)) {
    const baseContent = fs.readFileSync(rootUserFile, 'utf-8');
    if (!baseContent.includes(``)) {
      return new Response('Ownership match failed.', { status: 403 });
    }
  }

  // Create sub-directories safely if needed
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const identitySignature = `\n`;
  fs.writeFileSync(filePath, identitySignature + htmlContent, 'utf-8');

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
