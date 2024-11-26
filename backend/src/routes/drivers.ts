import { Router } from "express";
import { getDrivers } from "../controllers/driverController";

export const driverRouter = Router();

driverRouter.get("/", getDrivers);
