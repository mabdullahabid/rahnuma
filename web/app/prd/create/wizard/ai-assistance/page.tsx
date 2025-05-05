import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AIAssistancePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PRD Wizard</h1>
        <p className="text-slate-600">
          Generate your PRD by working through each step of the wizard.
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
            <div className="bg-slate-100 text-slate-900 px-3 py-2 rounded font-medium flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm">
                4
              </div>
              <span>AI Assistance</span>
            </div>
            <div className="px-3 py-2 rounded font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-sm">
                5
              </div>
              <span>Review</span>
            </div>
          </nav>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-medium mb-2">Project Progress</h3>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
              <div className="bg-slate-700 h-2.5 rounded-full w-[80%]"></div>
            </div>
            <p className="text-sm text-slate-600">4 of 5 steps completed</p>
          </div>
        </div>

        {/* Wizard Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">AI Assistance</h2>
            <p className="text-slate-600">
              Let Rahnuma's AI analyze your reference documents and current PRD draft to suggest 
              additional features, improvements, and identify potential gaps.
            </p>
          </div>

          {/* AI Analysis Options */}
          <div className="space-y-6">
            <div className="border rounded-lg p-5">
              <h3 className="font-medium mb-3">Document Analysis</h3>
              <p className="text-sm text-slate-600 mb-4">
                Analyze uploaded reference documents to extract key requirements and feature ideas.
              </p>
              <div className="flex items-center gap-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Analyze Documents
                </Button>
                <span className="text-sm text-slate-500">2 documents available</span>
              </div>
            </div>

            <div className="border rounded-lg p-5">
              <h3 className="font-medium mb-3">Gap Analysis</h3>
              <p className="text-sm text-slate-600 mb-4">
                Identify potential missing features or requirements based on similar project templates.
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Run Gap Analysis
              </Button>
            </div>

            <div className="border rounded-lg p-5">
              <h3 className="font-medium mb-3">Estimate Review</h3>
              <p className="text-sm text-slate-600 mb-4">
                Review and suggest adjustments to your time estimates based on historical data.
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Review Estimates
              </Button>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">AI Generated Suggestions</h3>
            
            <div className="bg-slate-50 border rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-700 mb-1">Add Password Recovery Feature</h4>
                  <p className="text-sm text-slate-600 mb-2">
                    Based on your authentication category, you might want to add a password 
                    recovery feature to allow users to reset forgotten passwords.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                      Add to Features
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                      Ignore
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-amber-700 mb-1">Consider Data Export Functionality</h4>
                  <p className="text-sm text-slate-600 mb-2">
                    Your requirements mention data visualization, but there's no mention of 
                    data export capabilities which is often needed by users.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                      Add to Features
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                      Ignore
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link href="/prd/create/wizard/features">
              <Button variant="outline">Previous: Features</Button>
            </Link>
            <Link href="/prd/create/wizard/review">
              <Button>Next: Review</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}