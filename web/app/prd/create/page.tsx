"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReferenceFileUpload } from "@/components/prd/reference-file-upload";
import { ReferenceUrlInput } from "@/components/prd/reference-url-input";
import { toast } from "sonner";
import { prdService } from "@/lib/api/prd";
import { useSearchParams } from "next/navigation";

export default function CreatePRD() {
  const searchParams = useSearchParams();
  const prdId = searchParams.get('id');
  const isEditMode = !!prdId;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(isEditMode);
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    clientName: "",
    overview: ""
  });
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [referenceUrls, setReferenceUrls] = useState<string[]>([]);
  const [existingReferences, setExistingReferences] = useState<Array<{
    id: number;
    name: string;
    source_type: string;
    content?: string;
    file_url?: string;
  }>>([]);

  // Fetch existing PRD data if in edit mode
  useEffect(() => {
    const fetchPRDData = async () => {
      if (!prdId) return;
      
      try {
        setIsFetchingData(true);
        // Fetch PRD details
        const prd = await prdService.getPRD(prdId);
        
        setProjectInfo({
          title: prd.title || "",
          clientName: prd.client_name || "",
          overview: prd.project_overview || ""
        });
        
        // Fetch PRD references
        const references = await prdService.getReferences(Number(prdId));
        setExistingReferences(references || []);
        
        // Extract URLs from the references
        const urls = references
          .filter(ref => ref.source_type === 'url')
          .map(ref => ref.content || "")
          .filter(Boolean);
        
        setReferenceUrls(urls);
      } catch (error) {
        console.error("Failed to fetch PRD data:", error);
        toast.error("Failed to load PRD data");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchPRDData();
  }, [prdId]);

  // Delete a reference
  const handleDeleteReference = async (referenceId: number) => {
    if (!prdId) return;
    
    try {
      await prdService.deleteReference(Number(prdId), referenceId);
      
      // Update the list of references after deletion
      setExistingReferences(prev => 
        prev.filter(ref => ref.id !== referenceId)
      );
      
      // Also remove from referenceUrls if it was a URL reference
      const deletedRef = existingReferences.find(ref => ref.id === referenceId);
      if (deletedRef?.source_type === 'url' && deletedRef.content) {
        setReferenceUrls(prev => 
          prev.filter(url => url !== deletedRef.content)
        );
      }
      
      toast.success("Reference removed successfully");
    } catch (error) {
      console.error("Failed to delete reference:", error);
      toast.error("Failed to remove reference");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesUploaded = (files: File[]) => {
    setReferenceFiles(files);
  };

  const handleUrlsAdded = (urls: string[]) => {
    setReferenceUrls(urls);
  };

  const handleContinue = async () => {
    if (!projectInfo.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    setIsLoading(true);
    try {
      let projectId = prdId;
      
      if (isEditMode) {
        // Update existing PRD
        await prdService.updatePRD(Number(prdId), {
          title: projectInfo.title,
          client_name: projectInfo.clientName,
          project_overview: projectInfo.overview
        });
      } else {
        // Create new PRD
        projectId = await prdService.createPRD({
          title: projectInfo.title,
          client_name: projectInfo.clientName,
          overview: projectInfo.overview
        });
      }

      // Upload reference files if any
      if (referenceFiles.length > 0) {
        await prdService.uploadReferenceFiles(projectId!, referenceFiles);
      }

      // Add new reference URLs if any
      const existingUrls = existingReferences
        .filter(ref => ref.source_type === 'url')
        .map(ref => ref.content || "")
        .filter(Boolean);
      
      const newUrls = referenceUrls.filter(url => !existingUrls.includes(url));
      
      if (newUrls.length > 0) {
        await prdService.addReferenceUrls(projectId!, newUrls);
      }

      toast.success(isEditMode ? "Project updated successfully" : "Project created successfully");
      // Navigate to the wizard
      window.location.href = `/prd/create/wizard?prdId=${projectId}`;
    } catch (error) {
      toast.error(isEditMode ? "Failed to update project" : "Failed to create project");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? 'Edit PRD' : 'Create New PRD'}
        </h1>
        <p className="text-slate-600">
          {isEditMode 
            ? 'Edit your Product Requirements Document and continue the wizard.' 
            : 'Walk through the process of creating a detailed Product Requirements Document.'}
        </p>
      </div>

      {isFetchingData ? (
        <Card>
          <CardContent className="p-6 flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="spinner mb-4 mx-auto w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p>Loading PRD data...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl">Project Information</CardTitle>
                </CardHeader>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={projectInfo.title}
                      onChange={handleInputChange}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      name="clientName"
                      value={projectInfo.clientName}
                      onChange={handleInputChange}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overview">Project Overview</Label>
                    <textarea
                      id="overview"
                      name="overview"
                      value={projectInfo.overview}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md h-32 resize-none"
                      placeholder="Provide a brief overview of the project"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl">Reference Documents</CardTitle>
                </CardHeader>
                <p className="text-slate-600">
                  Upload or link to any reference materials such as meeting notes, 
                  requirements docs, similar apps, etc.
                </p>
                
                {isEditMode && existingReferences.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Existing References:</h3>
                    <div className="grid gap-2">
                      {existingReferences.map(ref => (
                        <div key={ref.id} className="p-3 border rounded-md flex items-center">
                          <div className="mr-3">
                            {ref.source_type === 'file' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 truncate">
                            <p className="font-medium">{ref.name}</p>
                            {ref.source_type === 'url' && ref.content && (
                              <a href={ref.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline truncate">
                                {ref.content}
                              </a>
                            )}
                          </div>
                          <div className="flex items-center">
                            {ref.source_type === 'file' && ref.file_url && (
                              <a 
                                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${ref.file_url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 px-2"
                                title="View file"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteReference(ref.id)}
                              className="text-red-500 hover:text-red-700 p-1 ml-2 rounded-full hover:bg-red-50"
                              title="Remove reference"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Document Upload</Label>
                    <ReferenceFileUpload onFilesUploaded={handleFilesUploaded} />
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">External Links</Label>
                    <ReferenceUrlInput onUrlsAdded={handleUrlsAdded} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Link href="/prd">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button 
                  onClick={handleContinue} 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isEditMode ? 'Updating Project...' : 'Creating Project...') 
                    : 'Continue to Wizard'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}