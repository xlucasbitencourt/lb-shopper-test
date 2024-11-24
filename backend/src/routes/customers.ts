import { Router } from "express";
import { getCustomers } from "../controllers/customerController";

export const customerRouter = Router();

customerRouter.get("/", getCustomers);
