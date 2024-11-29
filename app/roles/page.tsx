"use client";

import { useState, useEffect } from "react";
import { RoleTable } from "@/components/roles/role-table";
import { RoleDialog } from "@/components/roles/role-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchRoles } from "@/lib/api";
import toast from "react-hot-toast";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadRoles() {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDelete = (id: string) => {
    setRoles(roles.filter((role: any) => role.id !== id));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        {/* <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button> */}
      </div>
      <RoleTable data={roles} onDelete={handleDelete} />
      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadRoles}
      />
    </div>
  );
}