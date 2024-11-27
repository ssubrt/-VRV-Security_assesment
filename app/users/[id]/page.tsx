"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { fetchRoles, updateUser } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  roleId: z.string().min(1, "Please select a role"),
  status: z.enum(["active", "inactive"]),
});

// Shimmer Loader
const ShimmerLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    <div className="h-12 bg-gray-200 rounded"></div>
    <div className="h-6 bg-gray-200 rounded w-1/4 mt-6"></div>
    <div className="h-12 bg-gray-200 rounded"></div>
    <div className="h-6 bg-gray-200 rounded w-1/4 mt-6"></div>
    <div className="h-12 bg-gray-200 rounded"></div>
    <div className="flex justify-end space-x-4 mt-6">
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Track initial load
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
      status: "active",
    },
  });

  useEffect(() => {
    async function loadUserAndRoles() {
      try {
        const [rolesData, userData] = await Promise.all([
          fetchRoles(),
          fetch(`/api/users/${params.id}`).then((res) => res.json()),
        ]);

        setRoles(rolesData);
        form.reset({
          name: userData.name,
          email: userData.email,
          roleId: userData.roleId,
          status: userData.status,
        });
      } catch (error) {
        toast.error("Failed to load user data");
        router.push("/users");
      } finally {
        setInitialLoading(false); // Data is loaded
      }
    }
    loadUserAndRoles();
  }, [params.id, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await updateUser(params.id, values);
      toast.success("User updated successfully");
      router.push("/users");
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          {initialLoading ? ( // Show shimmer loader while loading
            <ShimmerLoader />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password (leave empty to keep current)</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/users")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update User"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
