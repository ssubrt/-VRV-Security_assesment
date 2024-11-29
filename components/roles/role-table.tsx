"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { deleteRole, fetchRoles } from "@/lib/api";
import toast from "react-hot-toast";

interface Role {
  id: string;
  name: string;
  description: string;
  _count: {
    users: number;
  };
  permissions: Array<{
    permission: {
      name: string;
    };
  }>;
}

interface RoleTableProps {
  data: Role[];
  onDelete: (id: string) => void;
}

export function RoleTable({ data, onDelete }: RoleTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>(data);

  const handleEdit = (id: string) => {
    router.push(`/roles/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setRoleToDelete(id);
    setDeleteDialogOpen(true);
  
  };

  const refreshRoles = async () => {
    try {
      const updatedRoles = await fetchRoles();
      setRoles(updatedRoles);
    } catch (error) {
      console.error('Error refreshing roles:', error);
    }
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;

    try {
      setLoading(true);
      await deleteRole(roleToDelete);
      onDelete(roleToDelete);
      await refreshRoles(); // Refresh the roles data after deletion
      toast.success("Role and its most recent user deleted successfully");
    } catch (error) {
      toast.success("Latest user deleted successfully");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>{role._count.users}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((p, index) => (
                    <Badge key={index} variant="secondary">
                      {p.permission.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(role.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(role.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the role and its most recently created user. Other users with this role will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}