"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Shield, UserCheck, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { fetchUsers, fetchRoles } from "@/lib/api";

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeRoles: 0,
    activeSessions: 0,
    securityAlerts: 0,
  });

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [users, roles] = await Promise.all([
          fetchUsers(),
          fetchRoles(),
        ]);

        setMetrics({
          totalUsers: users.length,
          activeRoles: roles.length,
          activeSessions: Math.floor(Math.random() * 30), // Simulated active sessions
          securityAlerts: Math.floor(Math.random() * 5), // Simulated security alerts
        });
      } catch (error) {
        toast.error("Failed to load dashboard metrics");
      }
    }

    loadMetrics();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Active system users
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeRoles}</div>
          <p className="text-xs text-muted-foreground">
            Configured role types
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeSessions}</div>
          <p className="text-xs text-muted-foreground">
            Current online users
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.securityAlerts}</div>
          <p className="text-xs text-muted-foreground">
            Requires attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}