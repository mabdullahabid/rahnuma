"use client";

import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Rahnuma</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Your AI-powered assistant for streamlining business processes and automating tedious tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* PRD Module Card */}
        <Card>
          <CardHeader className="bg-indigo-600 text-white">
            <CardTitle>PRD Rahnuma</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-slate-600 mb-6">
              Create comprehensive product requirement documents with intelligent
              assistance. Generate PRDs from reference materials, meetings notes,
              and similar apps.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/prd">
              <Button>Get Started</Button>
            </Link>
            <span className="text-sm font-medium text-indigo-600 flex items-center">New</span>
          </CardFooter>
        </Card>

        {/* WhatsApp Bot Card - Coming Soon */}
        <Card className="opacity-75">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle>WhatsApp Rahnuma</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-slate-600 mb-6">
              Autonomous WhatsApp bots that can talk to you through messaging, manage your
              calendar, read emails, and perform other tasks.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button disabled>Coming Soon</Button>
            <span className="text-sm font-medium text-amber-600 flex items-center">In Development</span>
          </CardFooter>
        </Card>

        {/* Future Module - Placeholder */}
        <Card className="opacity-60">
          <CardHeader className="bg-slate-600 text-white">
            <CardTitle>Future Module</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-slate-600 mb-6">
              More Rahnuma modules are on the way. Stay tuned for additional AI-powered
              tools to enhance your productivity.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button disabled>Coming Soon</Button>
            <span className="text-sm font-medium text-slate-600 flex items-center">Planned</span>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
