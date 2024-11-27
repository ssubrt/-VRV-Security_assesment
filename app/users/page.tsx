"use client";

import { useState, useEffect } from "react";
import { UserTable } from "@/components/users/user-table";
import { UserDialog } from "@/components/users/user-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchUsers } from "@/lib/api";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadUsers() {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (id: string) => {
    setUsers(users.filter((user: any) => user.id !== id));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <UserTable data={users} onDelete={handleDelete} />
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadUsers}
      />
    </div>
  );
}