"use client";

import { useState } from "react";
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

export default function CreatePRD() {
  const [isLoading, setIsLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    clientName: "",
    overview: ""
  });
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [referenceUrls, setReferenceUrls] = useState<string[]>([]);

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
      // Create the PRD project
      const prdId = await prdService.createPRD({
        title: projectInfo.title,
        client_name: projectInfo.clientName,
        overview: projectInfo.overview
      });

      // Upload reference files if any
      if (referenceFiles.length > 0) {
        await prdService.uploadReferenceFiles(prdId, referenceFiles);
      }

      // Add reference URLs if any
      if (referenceUrls.length > 0) {
        await prdService.addReferenceUrls(prdId, referenceUrls);
      }

      toast.success("Project created successfully");
      // Navigate to the wizard
      window.location.href = `/prd/create/wizard?prdId=${prdId}`;
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New PRD</h1>
        <p className="text-slate-600">
          Walk through the process of creating a detailed Product Requirements Document.
        </p>
      </div>

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
                {isLoading ? 'Creating Project...' : 'Continue to Wizard'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}