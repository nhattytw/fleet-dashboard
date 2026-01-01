import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { api } from "@/lib/api";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Trash2,
  ArrowUpDown,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { Fleet } from "@/types";

type FleetStatus = "Active" | "Maintenance" | "Decommissioned";

export function FleetTable({
  searchQuery,
  showDecommissioned,
}: {
  searchQuery: string;
  showDecommissioned: boolean;
}) {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data: allFleets = [] } = useQuery({
    queryKey: ["fleets"],
    queryFn: async () => (await api.get<Fleet[]>("/fleets")).data,
  });

  const filteredData = useMemo(() => {
    return allFleets.filter(
      (v) => showDecommissioned || v.status !== "Decommissioned"
    );
  }, [allFleets, showDecommissioned]);

  const { mutate: updateFleet } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Fleet> }) =>
      api.patch(`/fleets/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      toast.success("Synchronized");
    },
  });

  const { mutate: deleteV } = useMutation({
    mutationFn: (id: string) => api.delete(`/fleets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      toast.success("Decommissioned");
    },
  });

  const columnHelper = createColumnHelper<Fleet>();
  const now = new Date();

  const columns = [
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fleet ID <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <input
          defaultValue={info.getValue()}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            if (e.target.value !== info.getValue()) {
              updateFleet({
                id: info.row.original.id,
                data: { name: e.target.value },
              });
            }
          }}
          className="bg-transparent font-mono font-bold focus:bg-white border-none focus:ring-1 focus:ring-black rounded px-1 w-full outline-none"
        />
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <select
          value={info.getValue()}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updateFleet({
              id: info.row.original.id,
              data: { status: e.target.value as FleetStatus },
            })
          }
          className={`text-[10px] font-bold uppercase rounded-full px-2 py-1 border-none cursor-pointer outline-none ${
            info.getValue() === "Active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Decommissioned">Decommissioned</option>
        </select>
      ),
    }),
    columnHelper.accessor("fuelLevel", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fuel <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="flex flex-col w-28 gap-1">
          <div className="flex justify-between text-[10px] font-mono">
            <input
              type="number"
              defaultValue={info.getValue()}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                updateFleet({
                  id: info.row.original.id,
                  data: { fuelLevel: parseInt(e.target.value, 10) },
                })
              }
              className="w-8 bg-transparent border-none outline-none"
            />
            <span>%</span>
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
            <div
              className={`h-full transition-all ${
                info.getValue() < 25 ? "bg-red-500" : "bg-black"
              }`}
              style={{ width: `${info.getValue()}%` }}
            />
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("lastMaintenance", {
      header: "Last Service",
      cell: (i) => (
        <span className="text-xs text-zinc-500">
          {new Date(i.getValue()).toLocaleDateString("en-GB")}
        </span>
      ),
    }),
    columnHelper.accessor("nextMaintenance", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Scheduled <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (i) => {
        const dateValue = new Date(i.getValue());
        const isWarning = dateValue < now;
        return (
          <div className="flex items-center gap-1">
            {isWarning && (
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            )}
            <span
              className={`text-xs ${
                isWarning ? "text-amber-600 font-semibold" : "text-zinc-500"
              }`}
            >
              {dateValue.toLocaleDateString("en-GB")}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("maintenanceDue", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deadline <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (i) => {
        const dateValue = new Date(i.getValue());
        const isCritical = dateValue < now;
        return (
          <div className="flex items-center gap-1">
            {isCritical && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
            <span
              className={`text-xs ${
                isCritical ? "text-red-600 font-bold" : "text-zinc-500"
              }`}
            >
              {dateValue.toLocaleDateString("en-GB")}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteV(info.row.original.id)}
            className="hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter: searchQuery, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 mb-24">
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-zinc-50/50">
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((c) => (
                  <TableCell key={c.id}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-zinc-500 font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
