import Link from "next/link";

export default function PRDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Rahnuma
          </Link>
          <nav className="space-x-6">
            <Link href="/prd" className="hover:text-slate-300">
              Dashboard
            </Link>
            <Link href="/prd/create" className="hover:text-slate-300">
              Create PRD
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow bg-slate-50">
        {children}
      </main>
      <footer className="bg-slate-800 text-white py-4">
        <div className="container mx-auto px-6 text-center text-sm">
          &copy; {new Date().getFullYear()} Rahnuma - All rights reserved
        </div>
      </footer>
    </div>
  );
}