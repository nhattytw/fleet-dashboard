import { z } from "zod";

export const fleetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["Active", "Maintenance", "Decommissioned"]),
  fuelLevel: z.number().min(0).max(100),
  lastMaintenance: z.string().datetime().optional(),
  nextMaintenance: z.string().datetime().optional(),
  maintenanceDue: z.string().datetime().optional(),
});

export const ticketSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type FleetInput = z.infer<typeof fleetSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
