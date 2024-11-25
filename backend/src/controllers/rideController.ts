import { Request, Response } from "express";
import { showById } from "../services/customerService";
import { getEstimateDrivers, confirmRide, showRides } from "../services/rideService";

export const estimateRide = async (req: Request, res: Response): Promise<any> => {
  const { origin, destination, customer_id } = req.body;
  try {
    if (!origin || !destination || !customer_id) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description:
          "Os campos origin, destination e customer_id devem ser preenchidos.",
      });
    }
    if (typeof origin !== "string" || typeof destination !== "string") {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Os campos origin e destination devem ser do tipo string.",
      });
    }
    if (origin === destination) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Os campos origin e destination não podem ser iguais.",
      });
    }

    const customer = await showById(customer_id);
    if (!customer) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Cliente não encontrado.",
      });
    }

    const route = await getEstimateDrivers({ origin, destination });
    if (route === 404) {
      return res.status(404).json({
        error_code: "DRIVERS_NOT_FOUND",
        error_description: "Não há motoristas disponíveis para essa rota.",
      });
    }
    if (route === 400) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description:
          "Não foi possível calcular a rota com os endereços informados.",
      });
    }
    return res.status(200).json(route);
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const confirmRideController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { customer_id, driver, origin, destination } = req.body;
  const customer = await showById(customer_id);
  if (!customer) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Cliente não encontrado.",
    });
  }
  if (!driver) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "O campo driver deve ser preenchido.",
    });
  }
  const { id, name } = driver;
  try {
    if (!customer_id || !id || !origin || !destination || !name) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description:
          "Os campos customer_id, driver.id, driver.name, origin e destination devem ser preenchidos.",
      });
    }
    if (origin === destination) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Os campos origin e destination não podem ser iguais.",
      });
    }
    const ride = await confirmRide(req.body);
    if (ride === 404) {
      return res.status(404).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista não encontrado.",
      });
    }
    if (ride === 406) {
      return res.status(400).json({
        error_code: "INVALID_DISTANCE",
        error_description: "Quilometragem inválida para o motorista",
      });
    }
    return res.status(200).json(ride);
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getRides = async (req: Request, res: Response): Promise<any> => {
  const { customer_id } = req.params;
  const { driver_id } = req.query;
  if (!customer_id) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "O campo customer_id deve ser preenchido.",
    });
  }
  const customer = await showById(Number(customer_id));
  if (!customer) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Cliente não encontrado.",
    });
  }
  try {
    const rides = await showRides(Number(customer_id), Number(driver_id));
    if (rides === 400) {
      return res.status(400).json({
        error_code: "INVALID_DRIVER",
        error_description: "Motorista invalido ",
      });
    }
    if (rides === 404) {
      return res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhum registro encontrado",
      });
    }
    return res.status(200).json(rides);
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};
