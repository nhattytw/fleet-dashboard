import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { FleetTable } from "@/components/fleet/FleetTable";
import { CommandCenter } from "@/components/dashboard/CommandCenter";
import { FleetToolbar } from "@/components/fleet/FleetToolbar";
import { useFleets } from "@/hooks/useFleets";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";

export function Dashboard() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDecommissioned, setShowDecommissioned] = useState(false);
  const { data: fleets = [] } = useFleets();

  useEffect(() => {
    const syncTable = () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
    };

    socket.on("stats_update", syncTable);

    return () => {
      socket.off("stats_update", syncTable);
    };
  }, [queryClient]);

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      <Header />

      <main className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
          <StatsCards />
        </div>

        <div className="space-y-4">
          <FleetToolbar
            fleets={fleets}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showDecommissioned={showDecommissioned}
            setShowDecommissioned={setShowDecommissioned}
          />

          <FleetTable
            searchQuery={searchQuery}
            showDecommissioned={showDecommissioned}
          />
        </div>
      </main>

      <CommandCenter />
    </div>
  );
}
