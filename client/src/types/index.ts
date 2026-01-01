export interface Fleet {
  id: string;
  name: string;
  status: "Active" | "Maintenance" | "Decommissioned";
  fuelLevel: number;
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceDue: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetToolbarProps {
  fleets: Fleet[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  showDecommissioned: boolean;
  setShowDecommissioned: (val: boolean) => void;
}

export interface Ticket {
  id: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface SocketStats {
  total: number;
  active: number;
  maintenance: number;
  averageFuel: number;
  overdueMaintenance: number;
  lastUpdated: string;
}

export interface Stats {
  total: number;
  active: number;
  maintenance: number;
  averageFuel: number;
  overdueMaintenance: number;
  lastUpdated: string;
}
