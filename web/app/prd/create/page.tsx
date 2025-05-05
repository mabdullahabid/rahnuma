import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreatePRD() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New PRD</h1>
        <p className="text-slate-600">
          Walk through the process of creating a detailed Product Requirements Document.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col gap-6">
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Project Information</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Overview
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md h-32"
                  placeholder="Provide a brief overview of the project"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Reference Documents</h2>
            <p className="text-slate-600 mb-4">
              Upload or link to any reference materials such as meeting notes, 
              requirements docs, similar apps, etc.
            </p>
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <p className="text-slate-600 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <Button className="mt-2">Browse Files</Button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  External Links
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Add links to reference materials"
                />
                <Button variant="outline" className="mt-2">
                  Add Link
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/prd">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Link href="/prd/create/wizard">
              <Button>Continue to Wizard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}