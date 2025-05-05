"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
  acceptedFileTypes?: string;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function ReferenceFileUpload({
  onFilesUploaded,
  acceptedFileTypes = ".pdf,.doc,.docx,.txt,.rtf,.md,.xlsx,.csv",
  maxFiles = 10,
  maxSizeMB = 10
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFiles = (filesToValidate: File[]): File[] => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    filesToValidate.forEach(file => {
      // Check file size
      if (file.size > maxSizeBytes) {
        invalidFiles.push(`${file.name} (exceeds maximum size of ${maxSizeMB}MB)`);
        return;
      }

      // Check file type if acceptedFileTypes is provided
      if (acceptedFileTypes && acceptedFileTypes !== '*') {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        if (!acceptedFileTypes.includes(fileExtension)) {
          invalidFiles.push(`${file.name} (unsupported file type)`);
          return;
        }
      }

      validFiles.push(file);
    });

    // Show warnings for invalid files
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} files couldn't be uploaded:`, {
        description: invalidFiles.join(', ')
      });
    }

    return validFiles;
  };

  const handleFilesAdded = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const filesArray = Array.from(newFiles);
    const validFiles = validateFiles(filesArray);
    
    // Check if adding these files would exceed the maxFiles limit
    if (files.length + validFiles.length > maxFiles) {
      toast.warning(`You can only upload a maximum of ${maxFiles} files.`);
      // Take only as many as we can fit
      const remainingSlots = maxFiles - files.length;
      validFiles.splice(remainingSlots);
    }
    
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesUploaded(updatedFiles);
      toast.success(`${validFiles.length} files added successfully.`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesAdded(e.target.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
    toast.info("File removed.");
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-slate-100 p-4 rounded-full">
            <Image 
              src="/file.svg" 
              alt="Upload" 
              width={36} 
              height={36} 
              className="text-slate-500"
            />
          </div>
          <div>
            <p className="text-lg font-medium">Drag & drop reference documents</p>
            <p className="text-sm text-slate-500 mt-1">
              Or click to browse your files
            </p>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            PDF, Word, Text, Markdown, Excel, and CSV files up to {maxSizeMB}MB
          </div>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept={acceptedFileTypes}
            onChange={handleFileInputChange}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2 block">Uploaded Files ({files.length}/{maxFiles})</Label>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <Card key={index} className="p-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Image 
                      src="/file.svg" 
                      alt="File" 
                      width={20} 
                      height={20} 
                      className="text-slate-400"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-slate-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}