"use client";

import { Layout } from "@/components/layout/layout";

export default function PRDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}