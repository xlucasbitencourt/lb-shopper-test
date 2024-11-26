import { Request, Response } from "express";
import { showAllDrivers } from "../services/driverService";

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await showAllDrivers();
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};