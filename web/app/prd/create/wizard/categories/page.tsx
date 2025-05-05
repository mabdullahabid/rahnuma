"use client";

import { useEffect, useState } from "react";
import { usePrdStore, exampleData } from "@/lib/store/prd-store";
import { prdService } from "@/lib/api/prd";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WizardLayout from "@/components/prd/wizard-layout";
import { Category } from "@/lib/store/prd-store";
import Link from "next/link";

export default function CategoriesPage() {
  const { 
    currentPrdId, 
    categories: storedCategories, 
    setCategories 
  } = usePrdStore();
  
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showExamples, setShowExamples] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    if (!currentPrdId) {
      setLoadingCategories(false);
      return;
    }
    
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories for PRD ID:", currentPrdId);
        const data = await prdService.getCategories(currentPrdId);
        console.log("Received categories data:", data);
        
        if (data.length === 0) {
          // If no categories returned from API, show the option to load examples
          setShowExamples(true);
        } else {
          setShowExamples(false);
        }
        
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
        // Show examples option if there was an error fetching categories
        setShowExamples(true);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, [currentPrdId, setCategories]);

  // Add the example categories
  const handleAddExamples = async () => {
    if (!currentPrdId) return;
    
    try {
      setLoading(true);
      
      // Add each example category to the backend
      const savedCategories = [];
      for (const category of exampleData.categories) {
        // Remove the negative ID before sending to backend
        const { id, ...categoryData } = category;
        const savedCategory = await prdService.addCategory(currentPrdId, categoryData);
        savedCategories.push(savedCategory);
      }
      
      // Update the store with the saved categories that now have proper backend IDs
      setCategories(savedCategories);
      setShowExamples(false);
      toast.success("Example categories added successfully");
    } catch (error) {
      console.error("Failed to add example categories:", error);
      toast.error("Failed to add example categories");
    } finally {
      setLoading(false);
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!currentPrdId) return;
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    try {
      setLoading(true);
      const data = await prdService.addCategory(currentPrdId, newCategory);
      setCategories([...storedCategories, data]);
      setNewCategory({ name: '', description: '' });
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing category
  const handleUpdateCategory = async () => {
    if (!currentPrdId || !editCategory) return;
    
    // Handle example data differently (skip API call)
    if (editCategory.id < 0) {
      const updatedCategories = storedCategories.map(cat => 
        cat.id === editCategory.id ? editCategory : cat
      );
      setCategories(updatedCategories);
      setEditCategory(null);
      toast.success("Example category updated successfully");
      return;
    }
    
    try {
      setLoading(true);
      const data = await prdService.updateCategory(currentPrdId, editCategory.id, {
        name: editCategory.name,
        description: editCategory.description
      });
      const updatedCategories = storedCategories.map(cat => cat.id === editCategory.id ? data : cat);
      setCategories(updatedCategories);
      setEditCategory(null);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId: number) => {
    if (!currentPrdId) return;
    
    if (!confirm("Are you sure you want to delete this category? All features in this category will also be deleted.")) {
      return;
    }
    
    // Handle example data differently (skip API call)
    if (categoryId < 0) {
      const updatedCategories = storedCategories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      toast.success("Example category deleted successfully");
      return;
    }
    
    try {
      setLoading(true);
      await prdService.deleteCategory(currentPrdId, categoryId);
      const updatedCategories = storedCategories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WizardLayout 
      currentStep={2}
      prevLink="/prd/create/wizard"
      nextLink="/prd/create/wizard/features"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Define Feature Categories</h2>
            <p className="text-slate-600">
              Group related features into logical categories to organize your PRD. 
              Categories could be based on functionality, user type, or system components.
            </p>
          </div>
          
          {/* Skip to AI Assistance button */}
          <Link href={`/prd/create/wizard/ai-assistance?prdId=${currentPrdId}`}>
            <Button variant="outline" className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
              Skip to AI Assistance
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {loadingCategories ? (
            <div className="p-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2">Loading categories...</p>
            </div>
          ) : (
            <>
              {showExamples && storedCategories.length === 0 && (
                <div className="p-4 border border-dashed rounded-md bg-slate-50 mb-6">
                  <h3 className="font-medium mb-2">Need Ideas?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    You can start with example categories to help you get started quickly.
                  </p>
                  <Button onClick={handleAddExamples} variant="outline">
                    Load Example Categories
                  </Button>
                </div>
              )}
              
              {storedCategories.map(category => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <div className="flex gap-2">
                      <button
                        className="text-slate-500 hover:text-slate-700"
                        onClick={() => setEditCategory(category)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        className="text-slate-500 hover:text-red-600"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {category.description}
                  </p>
                </div>
              ))}

              <div className="border border-dashed rounded-lg p-4">
                <h3 className="font-medium mb-2">{editCategory ? "Edit Category" : "Add New Category"}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., Reporting, Admin Panel, Settings"
                      value={editCategory ? editCategory.name : newCategory.name}
                      onChange={(e) =>
                        editCategory
                          ? setEditCategory({ ...editCategory, name: e.target.value })
                          : setNewCategory({ ...newCategory, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md h-20"
                      placeholder="Describe what this category encompasses"
                      value={editCategory ? editCategory.description : newCategory.description}
                      onChange={(e) =>
                        editCategory
                          ? setEditCategory({ ...editCategory, description: e.target.value })
                          : setNewCategory({ ...newCategory, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <Button 
                    onClick={editCategory ? handleUpdateCategory : handleAddCategory}
                    disabled={loading}
                  >
                    {loading 
                      ? (editCategory ? "Updating..." : "Adding...") 
                      : (editCategory ? "Update Category" : "Add Category")}
                  </Button>
                  {editCategory && (
                    <Button 
                      variant="outline" 
                      onClick={() => setEditCategory(null)}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </WizardLayout>
  );
}