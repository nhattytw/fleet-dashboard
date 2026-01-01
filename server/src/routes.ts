import { Router } from "express";
import { FleetController } from "./controllers/fleet.controller";
import { TicketController } from "./controllers/ticket.controller";

const router = Router();

router.get("/fleets", FleetController.getAll);
router.post("/fleets", FleetController.create);
router.patch("/fleets/:id", FleetController.update);
router.delete("/fleets/:id", FleetController.delete);
router.post("/tickets", TicketController.create);

export { router as routes };
