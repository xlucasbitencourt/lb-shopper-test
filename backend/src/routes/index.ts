import { Router } from "express";
import { customerRouter } from "./customers";
import { driverRouter } from "./drivers";
import { rideRouter } from "./rides";

export const router = Router();

router.use("/customer", customerRouter);
router.use("/driver", driverRouter);
router.use("/ride", rideRouter);

