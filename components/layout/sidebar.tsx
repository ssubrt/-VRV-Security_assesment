"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Users, 
  Shield,
  LogOut
} from "lucide-react";
import { logout } from "@/lib/api";
import toast from "react-hot-toast";


const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
  },
  {
    label: "Roles",
    icon: Shield,
    href: "/roles",
  },
  
];

export default function Sidebar() {
  const router = useRouter();

  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };


  return (
    <div className="flex flex-col w-64 border-r bg-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold">RBAC Admin</h1>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 mt-auto border-t">
        <Button  onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-500">
          <LogOut className="mr-2 h-5 w-5" 
          />
          Logout
        </Button>
      </div>
    </div>
  );
}