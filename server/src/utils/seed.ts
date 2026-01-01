import prisma from "../lib/prisma";

async function main() {
  await prisma.fleet.deleteMany({});
  const now = new Date();

  const daysAgo = (d: number) =>
    new Date(new Date().setDate(now.getDate() - d));
  const daysHence = (d: number) =>
    new Date(new Date().setDate(now.getDate() + d));

  await prisma.fleet.createMany({
    data: [
      // 1. ACTIVE + WARNING (Next Maintenance < Now, but Deadline > Now)
      {
        name: "FLT-WAR-01",
        status: "Active",
        fuelLevel: 65,
        lastMaintenance: daysAgo(90),
        nextMaintenance: daysAgo(2),
        maintenanceDue: daysHence(5),
      },
      // 2. ACTIVE + CRITICAL (Hard Deadline < Now)
      {
        name: "FLT-CRT-02",
        status: "Active",
        fuelLevel: 15,
        lastMaintenance: daysAgo(120),
        nextMaintenance: daysAgo(15),
        maintenanceDue: daysAgo(1),
      },
      // 3. DECOMMISSIONED
      {
        name: "FLT-DEC-03",
        status: "Decommissioned",
        fuelLevel: 0,
        lastMaintenance: daysAgo(200),
        nextMaintenance: daysAgo(100),
        maintenanceDue: daysAgo(90),
      },
      // 4-6. ACTIVE (On Track)
      {
        name: "FLT-ACT-04",
        status: "Active",
        fuelLevel: 80,
        lastMaintenance: daysAgo(10),
        nextMaintenance: daysHence(30),
        maintenanceDue: daysHence(60),
      },
      {
        name: "FLT-ACT-05",
        status: "Active",
        fuelLevel: 45,
        lastMaintenance: daysAgo(20),
        nextMaintenance: daysHence(40),
        maintenanceDue: daysHence(70),
      },
      {
        name: "FLT-ACT-06",
        status: "Active",
        fuelLevel: 90,
        lastMaintenance: daysAgo(5),
        nextMaintenance: daysHence(50),
        maintenanceDue: daysHence(80),
      },
      // 7. MAINTENANCE + CRITICAL (Hard Deadline < Now)
      {
        name: "FLT-CRT-07",
        status: "Maintenance",
        fuelLevel: 35,
        lastMaintenance: daysAgo(120),
        nextMaintenance: daysAgo(15),
        maintenanceDue: daysAgo(1),
      },
      // 8-9. MAINTENANCE (On Track)
      {
        name: "FLT-MNT-08",
        status: "Maintenance",
        fuelLevel: 50,
        lastMaintenance: daysAgo(1),
        nextMaintenance: daysHence(90),
        maintenanceDue: daysHence(120),
      },
      {
        name: "FLT-MNT-09",
        status: "Maintenance",
        fuelLevel: 20,
        lastMaintenance: daysAgo(5),
        nextMaintenance: daysHence(85),
        maintenanceDue: daysHence(115),
      },
    ],
  });

  console.log("Seed Complete");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
