"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

export default function PRDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Rahnuma
          </Link>
          <div className="flex items-center gap-6">
            <nav className="space-x-6">
              <Link href="/prd" className="hover:text-slate-300">
                Dashboard
              </Link>
              <Link href="/prd/create" className="hover:text-slate-300">
                Create PRD
              </Link>
            </nav>
            {!isLoading && user && (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-slate-300">Hello, </span>
                  <span className="font-medium">{user.first_name || user.username}</span>
                </div>
                <Button 
                  onClick={logout} 
                  variant="outline" 
                  className="text-white border-slate-600 hover:bg-slate-700"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
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