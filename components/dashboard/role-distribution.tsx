"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { fetchRoles } from "@/lib/api";
import toast from "react-hot-toast";

interface RoleCount {
  name: string;
  value: number;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function RoleDistribution() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RoleCount[]>([]);

  useEffect(() => {
    loadRoleDistribution();
  }, []);

  async function loadRoleDistribution() {
    try {
      const roles = await fetchRoles();
      const distribution: RoleCount[] = roles.map((role: { name: string; _count: { users: number } }) => ({
        name: role.name,
        value: role._count.users
      }));
      setData(distribution);
    } catch (error) {
      toast.error("Failed to load role distribution");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Role Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}