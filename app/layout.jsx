import { Providers } from "./providers";

export const metadata = {
  title: 'The Grid',
  description: 'Profile-only platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box', backgroundColor: '#000', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
