export const metadata = {
  title: 'The Grid',
  description: 'Profile-only network powered by GitHub.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
