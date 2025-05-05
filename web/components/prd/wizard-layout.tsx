"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { usePrdStore } from "@/lib/store/prd-store";
import { toast } from "sonner";

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  prevLink?: string;
  nextLink?: string;
}

export default function WizardLayout({ 
  children, 
  currentStep,
  prevLink,
  nextLink
}: WizardLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prdId = searchParams.get('prdId');
  
  // Get the PRD store
  const { 
    currentPrdId, 
    setPrdId,
    clearState
  } = usePrdStore();
  
  // Initialize the store with the PRD ID from URL if needed
  useEffect(() => {
    // If prdId in URL and different from store, update the store
    if (prdId && (!currentPrdId || Number(prdId) !== currentPrdId)) {
      setPrdId(Number(prdId));
    }
    // If no prdId in URL but we have one in store, redirect with prdId
    else if (!prdId && currentPrdId) {
      router.replace(`${window.location.pathname}?prdId=${currentPrdId}`);
    }
    // If no prdId anywhere, show error
    else if (!prdId && !currentPrdId) {
      toast.error("No PRD ID found. Please start over.");
      router.replace("/prd");
    }
  }, [prdId, currentPrdId, setPrdId, router]);

  // Calculate progress percentage
  const progressPercent = Math.min(100, (currentStep / 5) * 100);
  
  // Helper for building links with prdId
  const buildLink = (path: string) => {
    if (!path) return "";
    
    // If we have a prdId in the URL or store, add it to the link
    if (prdId) {
      return `${path}?prdId=${prdId}`;
    } else if (currentPrdId) {
      return `${path}?prdId=${currentPrdId}`;
    }
    
    return path;
  };

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
            <Link 
              href={buildLink("/prd/create/wizard")} 
              className={`px-3 py-2 rounded font-medium flex items-center gap-2 ${currentStep === 1 ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${currentStep === 1 ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                1
              </div>
              <span>User Roles</span>
            </Link>
            <Link 
              href={buildLink("/prd/create/wizard/categories")} 
              className={`px-3 py-2 rounded font-medium flex items-center gap-2 ${currentStep === 2 ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${currentStep === 2 ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                2
              </div>
              <span>Categories</span>
            </Link>
            <Link 
              href={buildLink("/prd/create/wizard/features")} 
              className={`px-3 py-2 rounded font-medium flex items-center gap-2 ${currentStep === 3 ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${currentStep === 3 ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                3
              </div>
              <span>Features</span>
            </Link>
            <Link 
              href={buildLink("/prd/create/wizard/ai-assistance")} 
              className={`px-3 py-2 rounded font-medium flex items-center gap-2 ${currentStep === 4 ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${currentStep === 4 ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                4
              </div>
              <span>AI Assistance</span>
            </Link>
            <Link 
              href={buildLink("/prd/create/wizard/review")} 
              className={`px-3 py-2 rounded font-medium flex items-center gap-2 ${currentStep === 5 ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${currentStep === 5 ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                5
              </div>
              <span>Review</span>
            </Link>
          </nav>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-medium mb-2">Project Progress</h3>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
              <div className="bg-slate-700 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-sm text-slate-600">{currentStep} of 5 steps completed</p>
          </div>
        </div>

        {/* Wizard Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {children}

          <div className="mt-8 flex justify-between">
            {prevLink ? (
              <Link href={buildLink(prevLink)}>
                <Button variant="outline">Previous</Button>
              </Link>
            ) : (
              <Link href="/prd">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            )}

            {nextLink && (
              <Link href={buildLink(nextLink)}>
                <Button>Next</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}