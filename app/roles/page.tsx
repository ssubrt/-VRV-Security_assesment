// app/roles/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoleDialog } from "@/components/roles/role-dialog";
import { RoleTable } from "@/components/roles/role-table";
import { fetchRoles } from "@/lib/api";
import toast from "react-hot-toast";

interface Role {
  id: string;
  name: string;
  description: string;
  _count: {
    users: number;
  };
  permissions: {
    permission: {
      id: string;
      name: string;
    };
  }[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }

  const handleSuccess = () => {
    setDialogOpen(false);
    loadRoles();
    toast.success("Role created successfully");
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading roles...</p>
        </div>
      ) : roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-muted-foreground">No roles found</p>
          <Button onClick={() => setDialogOpen(true)}>Create your first role</Button>
        </div>
      ) : (
        <RoleTable 
          data={roles} 
          onEdit={loadRoles} 
          onDelete={handleDelete} 
        />
      )}

      <RoleDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
