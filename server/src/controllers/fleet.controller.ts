import { Request, Response } from "express";
import { FleetService } from "../services/fleet.service";
import { fleetSchema } from "../utils/validation";

export class FleetController {
  static async getAll(req: Request, res: Response) {
    const fleets = await FleetService.getAll();

    res.json(fleets);
  }

  static async create(req: Request, res: Response) {
    try {
      const data = fleetSchema.parse(req.body);
      const fleet = await FleetService.create(data);

      res.json(fleet);
    } catch (e) {
      res.status(400).json({ error: "Validation failed" });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const fleet = await FleetService.update(id, data);

    res.json(fleet);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await FleetService.delete(id);

    res.json({ success: true });
  }
}
