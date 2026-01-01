import { useEffect, useState } from "react";
import { socket } from "@//lib/socket";
import { Activity, Truck, AlertTriangle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Stats } from "@/types";

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const handle = (data: Stats) => setStats(data);

    socket.on("stats_update", handle);

    return () => {
      socket.off("stats_update", handle);
    };
  }, []);

  if (!stats)
    return (
      <div className="p-10 text-center animate-pulse">
        Initializing Telemetry...
      </div>
    );

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatsCard
        title="Total Fleet"
        value={stats.total}
        icon={<Truck className="h-4 w-4" />}
        description="Active fleets"
      />

      <StatsCard
        title="Active"
        value={stats.active}
        icon={<Activity className="h-4 w-4 text-green-500" />}
        description="On duty"
      />

      <StatsCard
        title="Maintenance"
        value={stats.maintenance}
        icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
        description="In service"
      />

      <StatsCard
        title="Overdue"
        value={stats.overdueMaintenance}
        icon={<AlertCircle className="h-4 w-4 text-red-500" />}
        description="Maintenance due"
      />
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        {icon}
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
