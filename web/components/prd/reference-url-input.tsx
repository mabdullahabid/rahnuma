"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

interface UrlInputProps {
  onUrlsAdded: (urls: string[]) => void;
  maxUrls?: number;
}

export function ReferenceUrlInput({
  onUrlsAdded,
  maxUrls = 10
}: UrlInputProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const isValidUrl = (url: string): boolean => {
    try {
      // Add http:// prefix if missing
      const urlToCheck = url.match(/^https?:\/\//) ? url : `http://${url}`;
      new URL(urlToCheck);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddUrl = () => {
    if (!inputValue.trim()) {
      return;
    }

    if (urls.length >= maxUrls) {
      toast.warning(`You can only add a maximum of ${maxUrls} URLs.`);
      return;
    }

    // Format and validate URL
    let formattedUrl = inputValue.trim();
    if (!formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (!isValidUrl(formattedUrl)) {
      toast.error("Please enter a valid URL.");
      return;
    }

    if (urls.includes(formattedUrl)) {
      toast.error("This URL has already been added.");
      return;
    }

    const updatedUrls = [...urls, formattedUrl];
    setUrls(updatedUrls);
    onUrlsAdded(updatedUrls);
    setInputValue("");
    toast.success("URL added successfully.");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddUrl();
    }
  };

  const removeUrl = (index: number) => {
    const updatedUrls = [...urls];
    updatedUrls.splice(index, 1);
    setUrls(updatedUrls);
    onUrlsAdded(updatedUrls);
    toast.info("URL removed.");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    
    // Check if pasted content contains multiple lines
    if (pastedText.includes('\n')) {
      e.preventDefault();
      
      const pastedUrls = pastedText
        .split('\n')
        .map(url => url.trim())
        .filter(url => url && !urls.includes(url));
      
      // Validate and format URLs
      const validUrls = pastedUrls
        .map(url => url.match(/^https?:\/\//) ? url : `https://${url}`)
        .filter(url => isValidUrl(url));
      
      // Check against max limit
      const urlsToAdd = validUrls.slice(0, maxUrls - urls.length);
      
      if (urlsToAdd.length > 0) {
        const updatedUrls = [...urls, ...urlsToAdd];
        setUrls(updatedUrls);
        onUrlsAdded(updatedUrls);
        toast.success(`${urlsToAdd.length} URLs added successfully.`);
      }
      
      if (validUrls.length > urlsToAdd.length) {
        toast.warning(`Only ${urlsToAdd.length} URLs were added due to the maximum limit of ${maxUrls}.`);
      }
      
      if (validUrls.length < pastedUrls.length) {
        toast.error(`${pastedUrls.length - validUrls.length} URLs were invalid and not added.`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Enter URL to website or article"
          className="flex-1"
        />
        <Button onClick={handleAddUrl} type="button">Add URL</Button>
      </div>
      
      <div className="text-xs text-slate-500">
        Enter URLs to websites, articles, or documentation that contain relevant information for your PRD.
        You can paste multiple URLs at once.
      </div>

      {urls.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Reference URLs ({urls.length}/{maxUrls})</div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {urls.map((url, index) => (
              <Card key={index} className="p-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Image 
                      src="/globe.svg" 
                      alt="URL" 
                      width={20} 
                      height={20} 
                      className="text-slate-400"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 truncate block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {url}
                    </a>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-slate-400 hover:text-red-500"
                  onClick={() => removeUrl(index)}
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