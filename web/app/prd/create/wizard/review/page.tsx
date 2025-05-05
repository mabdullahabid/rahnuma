import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReviewPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PRD Wizard</h1>
        <p className="text-slate-600">
          Review your completed Product Requirements Document.
        </p>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {/* Wizard Navigation Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
          <nav className="space-y-1">
            <Link href="/prd/create/wizard" className="px-3 py-2 rounded font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm">
                1
              </div>
              <span>User Roles</span>
            </Link>
            <Link href="/prd/create/wizard/categories" className="px-3 py-2 rounded font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm">
                2
              </div>
              <span>Categories</span>
            </Link>
            <Link href="/prd/create/wizard/features" className="px-3 py-2 rounded font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm">
                3
              </div>
              <span>Features</span>
            </Link>
            <Link href="/prd/create/wizard/ai-assistance" className="px-3 py-2 rounded font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm">
                4
              </div>
              <span>AI Assistance</span>
            </Link>
            <div className="bg-slate-100 text-slate-900 px-3 py-2 rounded font-medium flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm">
                5
              </div>
              <span>Review</span>
            </div>
          </nav>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-medium mb-2">Project Progress</h3>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
              <div className="bg-slate-700 h-2.5 rounded-full w-[100%]"></div>
            </div>
            <p className="text-sm text-slate-600">5 of 5 steps completed</p>
          </div>
        </div>

        {/* Wizard Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Final Review</h2>
            <p className="text-slate-600">
              Review your PRD to ensure all requirements are correctly captured before finalizing.
            </p>
          </div>

          {/* PRD Summary */}
          <div className="space-y-6">
            {/* Project Overview */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Project Overview</h3>
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Project Title</p>
                  <p className="text-slate-800">E-Commerce Platform</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Client Name</p>
                  <p className="text-slate-800">TechRetail Inc.</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-500 mb-1">Description</p>
                <p className="text-slate-800 text-sm">
                  A modern e-commerce platform with advanced search, personalized recommendations, 
                  and a seamless checkout process. The platform will support multiple payment methods 
                  and include an inventory management system.
                </p>
              </div>
            </div>

            {/* User Roles */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">User Roles</h3>
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 rounded p-3">
                  <p className="font-medium mb-1">Admin User</p>
                  <p className="text-sm text-slate-600">
                    Administrators who manage the system, configure settings, and oversee all operations.
                  </p>
                </div>
                <div className="bg-slate-50 rounded p-3">
                  <p className="font-medium mb-1">Customer</p>
                  <p className="text-sm text-slate-600">
                    End users who browse products, make purchases, and manage their accounts.
                  </p>
                </div>
                <div className="bg-slate-50 rounded p-3">
                  <p className="font-medium mb-1">Store Manager</p>
                  <p className="text-sm text-slate-600">
                    Manages inventory, processes orders, and handles customer service issues.
                  </p>
                </div>
              </div>
            </div>

            {/* Categories and Features */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Categories & Features (10)</h3>
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
              </div>

              <div className="space-y-4">
                {/* Authentication Category */}
                <div>
                  <div className="bg-slate-50 rounded p-3 mb-2">
                    <p className="font-medium">Authentication</p>
                    <p className="text-sm text-slate-600">
                      User registration, login, logout, and account management features.
                    </p>
                  </div>
                  <div className="ml-3 space-y-2">
                    <div className="border rounded p-2 flex justify-between">
                      <div>
                        <p className="text-sm font-medium">User Registration</p>
                        <p className="text-xs text-slate-600">3 acceptance criteria</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                          High
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          8h
                        </span>
                      </div>
                    </div>
                    <div className="border rounded p-2 flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Password Recovery</p>
                        <p className="text-xs text-slate-600">2 acceptance criteria</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                          Medium
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          6h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Dashboard Category */}
                <div>
                  <div className="bg-slate-50 rounded p-3 mb-2">
                    <p className="font-medium">User Dashboard</p>
                    <p className="text-sm text-slate-600">
                      Main user interface with data visualization, summaries, and key navigation elements.
                    </p>
                  </div>
                  <div className="ml-3 space-y-2">
                    <div className="border rounded p-2 flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Analytics Dashboard</p>
                        <p className="text-xs text-slate-600">4 acceptance criteria</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                          Medium
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          16h
                        </span>
                      </div>
                    </div>
                    <div className="border rounded p-2 flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Data Export</p>
                        <p className="text-xs text-slate-600">2 acceptance criteria</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded-full">
                          Low
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          5h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Summary Statistics */}
            <div>
              <h3 className="font-medium mb-3">Project Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-slate-800">3</p>
                  <p className="text-sm text-slate-600">User Roles</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-slate-800">2</p>
                  <p className="text-sm text-slate-600">Categories</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-slate-800">4</p>
                  <p className="text-sm text-slate-600">Features</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-slate-800">35</p>
                  <p className="text-sm text-slate-600">Est. Hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-3">
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export to PDF
              </Button>
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share PRD
              </Button>
            </div>
            <div className="flex gap-3">
              <Link href="/prd/create/wizard/ai-assistance">
                <Button variant="outline">Previous: AI Assistance</Button>
              </Link>
              <Link href="/prd">
                <Button className="bg-green-600 hover:bg-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Finalize PRD
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}