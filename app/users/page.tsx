// app/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserDialog } from "@/components/users/user-dialog";
import { UserTable } from "@/components/users/user-table";
import { fetchUsers } from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  role: {
    name: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  const handleSuccess = () => {
    setDialogOpen(false);
    loadUsers();
    toast.success("User created successfully");
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-muted-foreground">No users found</p>
          <Button onClick={() => setDialogOpen(true)}>Create your first user</Button>
        </div>
      ) : (
        <UserTable 
          data={users} 
          onEdit={loadUsers} 
          onDelete={handleDelete} 
        />
      )}

      <UserDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
