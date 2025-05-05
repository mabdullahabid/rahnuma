"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { prdService } from "@/lib/api/prd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define the PRD type
interface PRD {
  id: number;
  title: string;
  client_name: string;
  overview?: string;
  created_at: string;
  updated_at?: string;
}

// Define the paginated response type
interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

export default function PRDDashboard() {
  const [prds, setPrds] = useState<PRD[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPRDs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await prdService.getAllPRDs();
        // Extract PRDs from the paginated response format
        setPrds(data.items || []);
      } catch (err) {
        console.error("Failed to fetch PRDs:", err);
        setError("Failed to load PRDs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPRDs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">PRD Rahnuma</h1>
        <Link href="/prd/create">
          <Button>Create New PRD</Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your PRDs</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading PRDs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : prds.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prds.map((prd) => (
              <Link href={`/prd/create?id=${prd.id}`} key={prd.id}>
                <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{prd.title}</CardTitle>
                    <CardDescription>{prd.client_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(prd.created_at).toLocaleDateString()}
                    </p>
                    <Button className="mt-3 w-full" variant="outline">Continue</Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No PRDs found. Create your first PRD to get started.</p>
        )}
      </div>
    </div>
  );
}