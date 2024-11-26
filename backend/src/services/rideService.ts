import { api } from "./axios";
import {
  showDriversAvailable,
  getDriverByIdAndName,
  getDriverById,
} from "./driverService";
import Ride from "../database/models/Ride";
import Driver from "../database/models/Driver";

type Places = {
  origin: string;
  destination: string;
};

type RideType = {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
};

const formatRouteData = (route: any) => {
  const { legs } = route.routes[0];
  const [leg] = legs;

  return {
    distance: route.routes[0].distanceMeters / 1000,
    duration: route.routes[0].duration,
    origin: {
      latitude: leg.startLocation.latLng.latitude,
      longitude: leg.startLocation.latLng.longitude,
    },
    destination: {
      latitude: leg.endLocation.latLng.latitude,
      longitude: leg.endLocation.latLng.longitude,
    },
  };
};

const formatDriversList = (drivers: any[], distanceMeters: number) =>
  drivers.map((driver) => ({
    id: driver.driverId,
    name: driver.name,
    description: driver.description,
    vehicle: driver.vehicle,
    review: {
      rating: driver.rating,
      comments: driver.comment,
    },
    value: (distanceMeters / 1000) * driver.fare,
  }));

export const getEstimateFromGoogle = async (places: Places) => {
  const bodyObject = {
    origin: { address: places.origin },
    destination: { address: places.destination },
    travelMode: "DRIVE",
  };

  try {
    const response = await api.post("/", bodyObject);
    return response.data;
  } catch (error: any) {
    throw new Error(`Google API error: ${error.message}`);
  }
};

export const getEstimateDrivers = async (places: Places) => {
  try {
    const route = await getEstimateFromGoogle(places);

    if (!route.routes)
      return {
        status: 400,
        response: {
          error_code: "INVALID_DATA",
          error_description: "Os dados fornecidos no corpo da requisioção são inválidos",
        },
      };

    const { distance, duration, origin, destination } = formatRouteData(route);

    const drivers = await showDriversAvailable(distance * 1000);
    if (!drivers.length)
      return {
        status: 404,
        response: {
          error_code: "DRIVER_NOT_FOUND",
          error_description: "Não há motoristas disponíveis para essa rota",
        },
      };

    const driversList = formatDriversList(drivers, distance * 1000);

    return {
      status: 200,
      response: {
        origin,
        destination,
        distance,
        duration,
        options: driversList,
        routeResponse: route,
      },
    };
  } catch (error: any) {
    return { status: 500, response: { message: error.message } };
  }
};

export const confirmRide = async (ride: RideType) => {
  try {
    const driver = await getDriverByIdAndName(ride.driver.id, ride.driver.name);
    if (!driver)
      return {
        status: 404,
        response: {
          error_code: "DRIVER_NOT_FOUND",
          error_description: "Motorista não encontrado",
        },
      };

    if (ride.distance < driver.minKm)
      return {
        status: 406,
        response: {
          error_code: "INVALID_DISTANCE",
          error_description: "Quilometragem inválida para o motorista",
        },
      };

    await Ride.create({
      driverId: ride.driver.id,
      customerId: ride.customer_id,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      value: ride.value,
      date: new Date().toISOString(),
    });

    return { status: 200, response: { success: true } };
  } catch (error: any) {
    return { status: 500, response: { message: error.message } };
  }
};

export const showRides = async (customerId: number, driverId?: number) => {
  try {
    const whereCondition = driverId ? { customerId, driverId } : { customerId };

    if (driverId) {
      const driver = await getDriverById(driverId);
      if (!driver)
        return {
          status: 400,
          response: {
            error_code: "INVALID_DRIVER",
            error_description: "Motorista inválido",
          },
        };
    }

    const rides = await Ride.findAll({
      where: whereCondition,
      include: [{ model: Driver, as: "driver" }],
    });

    if (!rides.length)
      return {
        status: 404,
        response: {
          error_code: "NO_RIDES_FOUND",
          error_description: "Nenhum registro encontrado",
        },
      };

    const ridesList = rides.map((ride) => ({
      id: ride.rideId,
      date: ride.date,
      origin: ride.origin,
      destination: ride.destination,
      distance: Number(ride.distance),
      duration: ride.duration,
      driver: {
        id: ride.driver.driverId,
        name: ride.driver.name,
      },
      value: Number(ride.value),
    }));

    const response = {
      customer_id: customerId.toString(),
      rides: ridesList,
    };

    return {
      status: 200,
      response,
    };
  } catch (error: any) {
    return { status: 500, response: { message: error.message } };
  }
};
