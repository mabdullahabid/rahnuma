import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturesPage() {
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
            <div className="bg-slate-100 text-slate-900 px-3 py-2 rounded font-medium flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm">
                3
              </div>
              <span>Features</span>
            </div>
            <div className="px-3 py-2 rounded font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-sm">
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
              <div className="bg-slate-700 h-2.5 rounded-full w-[60%]"></div>
            </div>
            <p className="text-sm text-slate-600">3 of 5 steps completed</p>
          </div>
        </div>

        {/* Wizard Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Define Features</h2>
            <p className="text-slate-600">
              Specify individual features for each category, including their details, priority, 
              effort estimates, and acceptance criteria.
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Category</label>
            <select className="w-full px-3 py-2 border rounded-md bg-white">
              <option value="">Select a category</option>
              <option value="authentication">Authentication</option>
              <option value="dashboard">User Dashboard</option>
            </select>
          </div>

          {/* Features Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Authentication Features</h3>
            </div>

            {/* Feature Card */}
            <div className="space-y-4 mb-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">User Registration</h4>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      High Priority
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      8 hours
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Allow users to create an account with email, name, and password.
                </p>
                
                <div className="mt-3">
                  <h5 className="text-sm font-medium mb-2">Acceptance Criteria:</h5>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Users can register with valid email and password</li>
                    <li>System validates email format and password strength</li>
                    <li>Users receive confirmation email after registration</li>
                  </ul>
                </div>
                
                <div className="flex justify-end gap-2 mt-3">
                  <button className="text-slate-500 hover:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button className="text-slate-500 hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Add New Feature Form */}
            <div className="border border-dashed rounded-lg p-4">
              <h3 className="font-medium mb-4">Add New Feature</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Feature Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., User Login, File Upload"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select className="w-full px-3 py-2 border rounded-md bg-white">
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md h-20"
                    placeholder="Detailed description of the feature"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Estimated development hours"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium mb-1">
                    <span>Acceptance Criteria</span>
                    <button className="text-sm text-blue-600 hover:underline">+ Add Another</button>
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border rounded-md"
                        placeholder="e.g., System must validate user inputs"
                      />
                      <button className="text-slate-500 hover:text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <Button>Add Feature</Button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link href="/prd/create/wizard/categories">
              <Button variant="outline">Previous: Categories</Button>
            </Link>
            <Link href="/prd/create/wizard/ai-assistance">
              <Button>Next: AI Assistance</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}