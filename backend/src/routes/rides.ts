import { Router } from "express";
import { estimateRide, confirmRideController } from "../controllers/rideController";

export const rideRouter = Router();

rideRouter.post("/estimate", estimateRide);
rideRouter.patch("/confirm", confirmRideController);