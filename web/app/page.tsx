"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Rahnuma
          </Link>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-600">
                  Hello, {user?.first_name || user?.username}
                </span>
                <Button 
                  onClick={logout} 
                  variant="outline" 
                  className="text-slate-700 border-slate-200"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Rahnuma</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Your AI-powered assistant for streamlining business processes and automating tedious tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* PRD Module Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-indigo-600 p-4">
              <h2 className="text-xl font-bold text-white">PRD Rahnuma</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6">
                Create comprehensive product requirement documents with intelligent
                assistance. Generate PRDs from reference materials, meetings notes,
                and similar apps.
              </p>
              <div className="flex justify-between items-center">
                <Link href="/prd">
                  <Button>Get Started</Button>
                </Link>
                <span className="text-sm font-medium text-indigo-600">New</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Bot Card - Coming Soon */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden opacity-75">
            <div className="bg-green-600 p-4">
              <h2 className="text-xl font-bold text-white">WhatsApp Rahnuma</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6">
                Autonomous WhatsApp bots that can talk to you through messaging, manage your
                calendar, read emails, and perform other tasks.
              </p>
              <div className="flex justify-between items-center">
                <Button disabled>Coming Soon</Button>
                <span className="text-sm font-medium text-amber-600">In Development</span>
              </div>
            </div>
          </div>

          {/* Future Module - Placeholder */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden opacity-60">
            <div className="bg-slate-600 p-4">
              <h2 className="text-xl font-bold text-white">Future Module</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6">
                More Rahnuma modules are on the way. Stay tuned for additional AI-powered
                tools to enhance your productivity.
              </p>
              <div className="flex justify-between items-center">
                <Button disabled>Coming Soon</Button>
                <span className="text-sm font-medium text-slate-600">Planned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
