import { Suspense } from 'react';
import { DashboardMetrics } from '@/components/dashboard/metrics';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { RoleDistribution } from '@/components/dashboard/role-distribution';
import { Skeleton } from '@/components/ui/skeleton';

function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[120px] w-full" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-[400px] w-full" />;
}

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>
      <div className="grid lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <RoleDistribution />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  );
}