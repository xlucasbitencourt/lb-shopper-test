import { Router } from "express";
import { customerRouter } from "./customers";
import { rideRouter } from "./rides";

export const router = Router();

router.use("/customer", customerRouter);
router.use("/ride", rideRouter);

