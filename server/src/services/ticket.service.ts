import prisma from "../lib/prisma";

export class TicketService {
  static async create(message: string) {
    return prisma.ticket.create({
      data: { message },
    });
  }

  static async getAll() {
    return prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }
}
