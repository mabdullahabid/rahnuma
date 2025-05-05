"use client";

import { useEffect, useState } from "react";
import { usePrdStore } from "@/lib/store/prd-store";
import { prdService } from "@/lib/api/prd";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WizardLayout from "@/components/prd/wizard-layout";
import { Role } from "@/lib/store/prd-store";

export default function PRDWizard() {
  const { 
    currentPrdId, 
    roles: storedRoles, 
    setRoles 
  } = usePrdStore();
  
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Fetch roles when component mounts
  useEffect(() => {
    if (!currentPrdId) {
      setLoadingRoles(false);
      return;
    }
    
    // Only fetch if we haven't already - this prevents multiple calls
    const fetchRoles = async () => {
      try {
        console.log("Fetching roles for PRD ID:", currentPrdId);
        const data = await prdService.getRoles(currentPrdId);
        console.log("Received roles data:", data);
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to load user roles");
      } finally {
        setLoadingRoles(false);
      }
    };
    
    fetchRoles();
  }, [currentPrdId, setRoles]);

  // Add a new role
  const handleAddRole = async () => {
    if (!currentPrdId) return;
    if (!newRole.name.trim()) {
      toast.error("Role name is required");
      return;
    }
    
    try {
      setLoading(true);
      const data = await prdService.addRole(currentPrdId, newRole);
      setRoles([...storedRoles, data]);
      setNewRole({ name: '', description: '' });
      toast.success("Role added successfully");
    } catch (error) {
      console.error("Failed to add role:", error);
      toast.error("Failed to add role");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing role
  const handleUpdateRole = async () => {
    if (!currentPrdId || !editRole) return;
    
    try {
      setLoading(true);
      const data = await prdService.updateRole(currentPrdId, editRole.id, {
        name: editRole.name,
        description: editRole.description
      });
      const updatedRoles = storedRoles.map(role => role.id === editRole.id ? data : role);
      setRoles(updatedRoles);
      setEditRole(null);
      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  // Delete a role
  const handleDeleteRole = async (roleId: number) => {
    if (!currentPrdId) return;
    
    if (!confirm("Are you sure you want to delete this role?")) {
      return;
    }
    
    try {
      setLoading(true);
      await prdService.deleteRole(currentPrdId, roleId);
      const updatedRoles = storedRoles.filter(role => role.id !== roleId);
      setRoles(updatedRoles);
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("Failed to delete role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WizardLayout 
      currentStep={1}
      nextLink="/prd/create/wizard/categories"
    >
      <div>
        <h2 className="text-xl font-semibold mb-4">Define User Roles</h2>
        <p className="text-slate-600 mb-6">
          Identify all the different types of users who will interact with your product and 
          describe their roles and responsibilities.
        </p>

        <div className="space-y-4">
          {loadingRoles ? (
            <div className="p-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2">Loading roles...</p>
            </div>
          ) : (
            <>
              {storedRoles.map((role) => (
                <div key={role.id} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{role.name}</h3>
                    <div className="flex gap-2">
                      <button
                        className="text-slate-500 hover:text-slate-700"
                        onClick={() => setEditRole(role)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        className="text-slate-500 hover:text-red-600"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {role.description}
                  </p>
                </div>
              ))}

              <div className="border border-dashed rounded-lg p-4">
                <h3 className="font-medium mb-2">{editRole ? "Edit Role" : "Add New Role"}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Role Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., Customer, Manager, User"
                      value={editRole ? editRole.name : newRole.name}
                      onChange={(e) =>
                        editRole
                          ? setEditRole({ ...editRole, name: e.target.value })
                          : setNewRole({ ...newRole, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md h-20"
                      placeholder="Describe the role's responsibilities and actions they can perform"
                      value={editRole ? editRole.description : newRole.description}
                      onChange={(e) =>
                        editRole
                          ? setEditRole({ ...editRole, description: e.target.value })
                          : setNewRole({ ...newRole, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <Button 
                    onClick={editRole ? handleUpdateRole : handleAddRole}
                    disabled={loading}
                  >
                    {loading 
                      ? (editRole ? "Updating..." : "Adding...") 
                      : (editRole ? "Update Role" : "Add Role")}
                  </Button>
                  {editRole && (
                    <Button 
                      variant="outline" 
                      onClick={() => setEditRole(null)}
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