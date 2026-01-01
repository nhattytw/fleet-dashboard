import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";

export class TicketController {
  static async create(req: Request, res: Response) {
    const { message } = req.body;
    const ticket = await TicketService.create(message);
    
    res.json(ticket);
  }
}
