import { Router } from "express";
import { estimateRide, confirmRideController, getRides } from "../controllers/rideController";

export const rideRouter = Router();

rideRouter.post("/estimate", estimateRide);
rideRouter.patch("/confirm", confirmRideController);
rideRouter.get("/:customer_id", getRides);