import { Request, Response } from "express";
import { showById } from "../services/customerService";
import { getEstimateDrivers, confirmRide, showRides } from "../services/rideService";

const validateFields = (
  fields: Record<string, any>
): { isValid: boolean; message?: string } => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return { isValid: false, message: `O campo ${key} deve ser preenchido.` };
    }
  }
  return { isValid: true };
};

const validateStringFields = (
  fields: Record<string, any>
): { isValid: boolean; message?: string } => {
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string") {
      return { isValid: false, message: `O campo ${key} deve ser do tipo string.` };
    }
  }
  return { isValid: true };
};

const sendErrorResponse = (
  res: Response,
  status: number,
  errorCode: string,
  description: string
) => {
  return res
    .status(status)
    .json({ error_code: errorCode, error_description: description });
};

export const estimateRide = async (req: Request, res: Response): Promise<void> => {
  const { origin, destination, customer_id } = req.body;

  const fieldValidation = validateFields({ origin, destination, customer_id });
  if (!fieldValidation.isValid) {
    sendErrorResponse(res, 400, "INVALID_DATA", fieldValidation.message!);
    return;
  }

  const typeValidation = validateStringFields({ origin, destination });
  if (!typeValidation.isValid) {
    sendErrorResponse(res, 400, "INVALID_DATA", typeValidation.message!);
    return;
  }

  if (origin === destination) {
    sendErrorResponse(
      res,
      400,
      "INVALID_DATA",
      "Os campos origin e destination não podem ser iguais."
    );
    return;
  }

  try {
    const customer = await showById(customer_id);
    if (!customer) {
      sendErrorResponse(res, 400, "INVALID_DATA", "Cliente não encontrado.");
      return;
    }

    const route = await getEstimateDrivers({ origin, destination });
    res.status(route.status).json(route.response);
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const confirmRideController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { customer_id, driver, origin, destination, distance, duration, value } =
    req.body;

  const fieldValidation = validateFields({
    customer_id,
    driver,
    origin,
    destination,
    distance,
    duration,
    value,
  });
  if (!fieldValidation.isValid) {
    sendErrorResponse(res, 400, "INVALID_DATA", fieldValidation.message!);
    return;
  }

  if (!driver.id || !driver.name) {
    sendErrorResponse(
      res,
      400,
      "INVALID_DATA",
      "Os campos driver.id e driver.name devem ser preenchidos."
    );
    return;
  }

  if (origin === destination) {
    sendErrorResponse(
      res,
      400,
      "INVALID_DATA",
      "Os campos origin e destination não podem ser iguais."
    );
    return;
  }

  try {
    const customer = await showById(customer_id);
    if (!customer) {
      sendErrorResponse(res, 400, "INVALID_DATA", "Cliente não encontrado.");
      return;
    }

    const ride = await confirmRide(req.body);
    res.status(ride.status).json(ride.response);
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getRides = async (req: Request, res: Response): Promise<void> => {
  const { customer_id } = req.params;
  const { driver_id } = req.query;

  const fieldValidation = validateFields({ customer_id });
  if (!fieldValidation.isValid) {
    sendErrorResponse(res, 400, "INVALID_DATA", fieldValidation.message!);
    return;
  }

  try {
    const customer = await showById(Number(customer_id));
    if (!customer) {
      sendErrorResponse(res, 400, "INVALID_DATA", "Cliente não encontrado.");
      return;
    }

    const rides = await showRides(
      Number(customer_id),
      driver_id ? Number(driver_id) : undefined
    );
    res.status(rides.status).json(rides.response);
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};
