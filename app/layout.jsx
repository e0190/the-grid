'use client';
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>The Grid</title>
      </head>
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box', backgroundColor: '#000', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
