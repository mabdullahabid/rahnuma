import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PRDDashboard() {
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
        <div className="grid gap-4">
          {/* PRD list will be loaded here dynamically */}
          <p className="text-gray-500">No PRDs found. Create your first PRD to get started.</p>
        </div>
      </div>
    </div>
  );
}