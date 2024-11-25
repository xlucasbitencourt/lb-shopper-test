import { Router } from "express";
import { estimateRide } from "../controllers/rideController";

export const rideRouter = Router();

rideRouter.post("/estimate", estimateRide);
