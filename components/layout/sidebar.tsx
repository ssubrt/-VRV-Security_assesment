"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Users, 
  Shield,
  Settings,
  LogOut
} from "lucide-react";


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
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const router = useRouter();


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
        <Button variant="ghost" className="w-full justify-start text-red-500">
          <LogOut className="mr-2 h-5 w-5" 
          onClick={() => router.push("/login") } />
          Logout
        </Button>
      </div>
    </div>
  );
}