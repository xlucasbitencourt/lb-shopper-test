import { Request, Response } from "express";
import { showCustomers } from "../services/customerService";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await showCustomers();
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};