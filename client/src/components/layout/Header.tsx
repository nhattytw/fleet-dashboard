import { Truck } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>

          <h1 className="text-xl font-bold">FleetOS</h1>
        </div>

        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </header>
  );
}
