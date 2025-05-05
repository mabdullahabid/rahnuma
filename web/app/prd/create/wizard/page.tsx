import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PRDWizard() {
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
            <div className="bg-slate-100 text-slate-900 px-3 py-2 rounded font-medium flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm">
                1
              </div>
              <span>User Roles</span>
            </div>
            <div className="px-3 py-2 rounded font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-sm">
                2
              </div>
              <span>Categories</span>
            </div>
            <div className="px-3 py-2 rounded font-medium flex items-center gap-2 text-slate-700 hover:bg-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-sm">
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
              <div className="bg-slate-700 h-2.5 rounded-full w-[20%]"></div>
            </div>
            <p className="text-sm text-slate-600">1 of 5 steps completed</p>
          </div>
        </div>

        {/* Wizard Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Define User Roles</h2>
          <p className="text-slate-600 mb-6">
            Identify all the different types of users who will interact with your product and 
            describe their roles and responsibilities.
          </p>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Admin User</h3>
                <div className="flex gap-2">
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
              <p className="text-sm text-slate-600">
                Administrators who manage the system, configure settings, and oversee all operations.
              </p>
            </div>

            <div className="border border-dashed rounded-lg p-4">
              <h3 className="font-medium mb-2">Add New Role</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Role Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Customer, Manager, User"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md h-20"
                    placeholder="Describe the role's responsibilities and actions they can perform"
                  ></textarea>
                </div>
                <Button>Add Role</Button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link href="/prd/create">
              <Button variant="outline">Back</Button>
            </Link>
            <Link href="/prd/create/wizard/categories">
              <Button>Next: Categories</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}