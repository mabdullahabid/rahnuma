"use client";

import { useEffect, useState } from "react";
import { usePrdStore } from "@/lib/store/prd-store";
import { prdService } from "@/lib/api/prd";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WizardLayout from "@/components/prd/wizard-layout";
import { Category, Feature, AcceptanceCriteria } from "@/lib/store/prd-store";

export default function FeaturesPage() {
  const { 
    currentPrdId, 
    categories: storedCategories,
    features: storedFeatures,
    setFeatures 
  } = usePrdStore();
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentCategoryFeatures, setCurrentCategoryFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFeatures, setLoadingFeatures] = useState(false);
  
  // New feature state
  const [newFeature, setNewFeature] = useState<{
    title: string;
    description: string;
    priority: string;
    estimate_hours: number;
    acceptance_criteria: { description: string }[];
  }>({
    title: '',
    description: '',
    priority: '',
    estimate_hours: 0,
    acceptance_criteria: [{ description: '' }]
  });

  // Set initial selected category if available
  useEffect(() => {
    if (storedCategories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(storedCategories[0].id);
    }
  }, [storedCategories, selectedCategoryId]);

  // Fetch features for selected category
  useEffect(() => {
    if (!currentPrdId || !selectedCategoryId) {
      setLoadingFeatures(false);
      return;
    }
    
    const fetchFeatures = async () => {
      try {
        setLoadingFeatures(true);
        console.log("Fetching features for PRD ID:", currentPrdId, "and Category ID:", selectedCategoryId);
        const data = await prdService.getFeatures(currentPrdId, selectedCategoryId);
        console.log("Received features data:", data);
        
        // Add fetched features to the store
        setFeatures((prevFeatures) => {
          // Filter out any features for this category that might already exist
          const otherFeatures = prevFeatures.filter(
            feature => feature.category_id !== selectedCategoryId
          );
          return [...otherFeatures, ...data];
        });
        
        // Set current category features for display
        setCurrentCategoryFeatures(data);
      } catch (error) {
        console.error("Failed to fetch features:", error);
        toast.error("Failed to load features");
      } finally {
        setLoadingFeatures(false);
      }
    };
    
    fetchFeatures();
  }, [currentPrdId, selectedCategoryId, setFeatures]);

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value);
    setSelectedCategoryId(categoryId);
  };

  // Add a new acceptance criteria field
  const handleAddAcceptanceCriteria = () => {
    setNewFeature({
      ...newFeature,
      acceptance_criteria: [...newFeature.acceptance_criteria, { description: '' }]
    });
  };

  // Remove an acceptance criteria field
  const handleRemoveAcceptanceCriteria = (index: number) => {
    const updatedCriteria = [...newFeature.acceptance_criteria];
    updatedCriteria.splice(index, 1);
    setNewFeature({
      ...newFeature,
      acceptance_criteria: updatedCriteria
    });
  };

  // Update acceptance criteria
  const handleAcceptanceCriteriaChange = (index: number, value: string) => {
    const updatedCriteria = [...newFeature.acceptance_criteria];
    updatedCriteria[index].description = value;
    setNewFeature({
      ...newFeature,
      acceptance_criteria: updatedCriteria
    });
  };

  // Add a new feature
  const handleAddFeature = async () => {
    if (!currentPrdId || !selectedCategoryId) {
      toast.error("Please select a category first");
      return;
    }
    
    if (!newFeature.title.trim()) {
      toast.error("Feature title is required");
      return;
    }
    
    if (newFeature.acceptance_criteria.some(ac => !ac.description.trim())) {
      toast.error("All acceptance criteria must have a description");
      return;
    }
    
    try {
      setLoading(true);
      const data = await prdService.addFeature(currentPrdId, selectedCategoryId, newFeature);
      
      // Update store with new feature
      setFeatures([...storedFeatures, data]);
      // Update current category features view
      setCurrentCategoryFeatures([...currentCategoryFeatures, data]);
      
      // Reset form
      setNewFeature({
        title: '',
        description: '',
        priority: '',
        estimate_hours: 0,
        acceptance_criteria: [{ description: '' }]
      });
      
      toast.success("Feature added successfully");
    } catch (error) {
      console.error("Failed to add feature:", error);
      toast.error("Failed to add feature");
    } finally {
      setLoading(false);
    }
  };

  // Delete a feature
  const handleDeleteFeature = async (featureId: number) => {
    if (!currentPrdId || !selectedCategoryId) return;
    
    if (!confirm("Are you sure you want to delete this feature?")) {
      return;
    }
    
    try {
      setLoading(true);
      await prdService.deleteFeature(currentPrdId, selectedCategoryId, featureId);
      
      // Update store by removing the feature
      const updatedFeatures = storedFeatures.filter(feature => feature.id !== featureId);
      setFeatures(updatedFeatures);
      
      // Update current view
      const updatedCurrentFeatures = currentCategoryFeatures.filter(feature => feature.id !== featureId);
      setCurrentCategoryFeatures(updatedCurrentFeatures);
      
      toast.success("Feature deleted successfully");
    } catch (error) {
      console.error("Failed to delete feature:", error);
      toast.error("Failed to delete feature");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WizardLayout 
      currentStep={3}
      prevLink="/prd/create/wizard/categories"
      nextLink="/prd/create/wizard/ai-assistance"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">Define Features</h2>
        <p className="text-slate-600 mb-6">
          Specify individual features for each category, including their details, priority, 
          effort estimates, and acceptance criteria.
        </p>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Category</label>
          <select 
            className="w-full px-3 py-2 border rounded-md bg-white"
            value={selectedCategoryId || ''}
            onChange={handleCategoryChange}
            disabled={storedCategories.length === 0}
          >
            <option value="">Select a category</option>
            {storedCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {storedCategories.length === 0 && (
            <p className="text-sm text-amber-600 mt-2">
              Please add categories in the previous step before adding features.
            </p>
          )}
        </div>

        {/* Features Section */}
        {selectedCategoryId && (
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {storedCategories.find(c => c.id === selectedCategoryId)?.name} Features
              </h3>
            </div>

            {loadingFeatures ? (
              <div className="p-6 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2">Loading features...</p>
              </div>
            ) : (
              <>
                {/* Feature Cards */}
                {currentCategoryFeatures.length === 0 ? (
                  <p className="text-slate-600 italic mb-4">No features yet for this category. Add your first feature below.</p>
                ) : (
                  <div className="space-y-4 mb-6">
                    {currentCategoryFeatures.map(feature => (
                      <div key={feature.id} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{feature.title}</h4>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {feature.priority} Priority
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {feature.estimate_hours} hours
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {feature.description}
                        </p>
                        
                        <div className="mt-3">
                          <h5 className="text-sm font-medium mb-2">Acceptance Criteria:</h5>
                          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            {feature.acceptance_criteria.map((criteria, index) => (
                              <li key={index}>{criteria.description}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-3">
                          <button 
                            className="text-slate-500 hover:text-red-600"
                            onClick={() => handleDeleteFeature(feature.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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
                          value={newFeature.title}
                          onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <select 
                          className="w-full px-3 py-2 border rounded-md bg-white"
                          value={newFeature.priority}
                          onChange={(e) => setNewFeature({ ...newFeature, priority: e.target.value })}
                        >
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
                        value={newFeature.description}
                        onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Estimated Hours</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Estimated development hours"
                        value={newFeature.estimate_hours}
                        onChange={(e) => setNewFeature({ ...newFeature, estimate_hours: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-sm font-medium mb-1">
                        <span>Acceptance Criteria</span>
                        <button 
                          className="text-sm text-blue-600 hover:underline"
                          onClick={handleAddAcceptanceCriteria}
                          type="button"
                        >
                          + Add Another
                        </button>
                      </label>
                      <div className="space-y-2">
                        {newFeature.acceptance_criteria.map((criteria, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border rounded-md"
                              placeholder="e.g., System must validate user inputs"
                              value={criteria.description}
                              onChange={(e) => handleAcceptanceCriteriaChange(index, e.target.value)}
                            />
                            <button 
                              className="text-slate-500 hover:text-red-600"
                              onClick={() => handleRemoveAcceptanceCriteria(index)}
                              disabled={newFeature.acceptance_criteria.length <= 1}
                              type="button"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleAddFeature} 
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Feature"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </WizardLayout>
  );
}