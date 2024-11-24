import { Router } from "express";
import { customerRouter } from "./customers";

export const router = Router();

router.use("/customer", customerRouter);

