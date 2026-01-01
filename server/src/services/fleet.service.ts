import { FleetInput } from "../utils/validation";
import prisma from "../lib/prisma";
import { getIO } from "../socket/socket.handler";

export class FleetService {
  static async getAll() {
    return prisma.fleet.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async update(id: string, data: Partial<FleetInput>) {
    const updateData: any = { ...data };

    if (data.lastMaintenance)
      updateData.lastMaintenance = new Date(data.lastMaintenance);

    if (data.nextMaintenance)
      updateData.nextMaintenance = new Date(data.nextMaintenance);

    if (data.maintenanceDue)
      updateData.maintenanceDue = new Date(data.maintenanceDue);

    const fleet = await prisma.fleet.update({
      where: { id },
      data: updateData,
    });

    await this.broadcastStats();

    return fleet;
  }

  static async delete(id: string) {
    const fleet = await prisma.fleet.update({
      where: { id },
      data: {
        status: "Decommissioned",
      },
    });

    await this.broadcastStats();

    return fleet;
  }

  static async create(data: FleetInput) {
    const createData: any = {
      name: data.name,
      status: data.status,
      fuelLevel: data.fuelLevel,
      lastSeen: new Date(),
      lastMaintenance: data.lastMaintenance
        ? new Date(data.lastMaintenance)
        : new Date(),
      nextMaintenance: data.nextMaintenance
        ? new Date(data.nextMaintenance)
        : new Date(new Date().setMonth(new Date().getMonth() + 3)), // Default 3 months from now
      maintenanceDue: data.maintenanceDue
        ? new Date(data.maintenanceDue)
        : new Date(new Date().setMonth(new Date().getMonth() + 6)), // Default 6 months from now
    };

    const fleet = await prisma.fleet.create({
      data: createData,
    });

    await this.broadcastStats();

    return fleet;
  }

  static async getStats() {
    const [total, active, maintenance, activeFleets] = await Promise.all([
      prisma.fleet.count({ where: { status: { not: "Decommissioned" } } }),
      prisma.fleet.count({ where: { status: "Active" } }),
      prisma.fleet.count({ where: { status: "Maintenance" } }),
      prisma.fleet.findMany({ where: { status: "Active" } }),
    ]);

    const averageFuel =
      activeFleets.length > 0
        ? Math.round(
            activeFleets.reduce(
              (sum: number, v: { fuelLevel: number }) => sum + v.fuelLevel,
              0
            ) / activeFleets.length
          )
        : 0;

    const now = new Date();
    const overdueMaintenance = await prisma.fleet.count({
      where: {
        status: { not: "Decommissioned" },
        maintenanceDue: {
          lt: now,
        },
      },
    });

    return {
      total,
      active,
      maintenance,
      averageFuel,
      overdueMaintenance,
      lastUpdated: new Date().toISOString(),
    };
  }

  static async broadcastStats() {
    try {
      const stats = await this.getStats();
      const io = getIO();

      io.emit("stats_update", stats);
    } catch (error) {
      console.error("Failed to broadcast stats:", error);
    }
  }
}
