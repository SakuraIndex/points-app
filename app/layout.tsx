import "./globals.css";

export const metadata = { title: "Sakura Points", description: "ポイント管理（MVP）" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="max-w-4xl mx-auto p-4">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sakura Points</h1>
          <nav className="space-x-3 text-sm">
            <a href="/dashboard">Dashboard</a>
            <a href="/accounts">Accounts</a>
            <a href="/import">Import CSV</a>
          </nav>
        </header>
        {children}
        <footer className="mt-8 text-xs opacity-70">© Sakura Index</footer>
      </body>
    </html>
  );
}
