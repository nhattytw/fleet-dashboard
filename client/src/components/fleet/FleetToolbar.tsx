import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, Download, Eye, EyeOff, Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Papa from "papaparse";
import type { FleetToolbarProps } from "@/types";

export function FleetToolbar({
  fleets,
  searchQuery,
  setSearchQuery,
  showDecommissioned,
  setShowDecommissioned,
}: FleetToolbarProps) {
  const queryClient = useQueryClient();

  const { mutate: addFleet, isPending } = useMutation({
    mutationFn: async () => {
      const response = await api.post("/fleets", {
        name: `Fleet-${Math.floor(Math.random() * 999)}`,
        status: "Active",
        fuelLevel: 100,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      toast.success("Fleet added");
    },
  });

  const handleExportCSV = () => {
    const exportData = fleets.map((f) => ({
      "Fleet ID": f.name,
      Status: f.status,
      "Fuel Level (%)": `${f.fuelLevel}%`,
      "Last Service": new Date(f.lastMaintenance).toLocaleDateString("en-GB"),
      "Next Service": new Date(f.nextMaintenance).toLocaleDateString("en-GB"),
      Deadline: new Date(f.maintenanceDue).toLocaleDateString("en-GB"),
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `fleet-report-${new Date().toISOString().split("T")[0]}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID or Status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDecommissioned(!showDecommissioned)}
        >
          {showDecommissioned ? (
            <EyeOff className="h-4 w-4 mr-2" />
          ) : (
            <Eye className="h-4 w-4 mr-2" />
          )}
          {showDecommissioned ? "Hide" : "Show"} Decommissioned
        </Button>

        <div className="flex gap-2 w-full justify-end">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>

          <Button size="sm" onClick={() => addFleet()} disabled={isPending}>
            <Plus className="h-4 w-4 mr-2" /> Add Fleet
          </Button>
        </div>
      </div>
    </div>
  );
}
