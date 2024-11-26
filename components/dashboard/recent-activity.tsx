"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchActivities } from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Activity {
  id: string;
  action: string;
  target: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export function RecentActivity() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const data = await fetchActivities();
      setActivities(data);
    } catch (error) {
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {activity.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} {activity.target}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.createdAt), "PPp")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}