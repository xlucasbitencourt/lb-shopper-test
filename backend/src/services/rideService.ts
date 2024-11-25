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

export const getEstimateFromGoogle = async (places: Places) => {
  const { origin, destination } = places;
  const bodyObject = {
    origin: { address: origin },
    destination: { address: destination },
    travelMode: "DRIVE",
  };
  try {
    const ride = await api.post("/", bodyObject);
    return ride.data;
  } catch (error: any) {
    return { message: (error as Error).message };
  }
};

export const getEstimateDrivers = async (places: Places) => {
  try {
    const route = await getEstimateFromGoogle(places);
    if (!route.routes) return 400;

    const { distanceMeters, duration } = route.routes[0];
    if (!distanceMeters || !duration) return 400;

    const origin = {
      latitude: route.routes[0].legs[0].startLocation.latLng.latitude,
      longitude: route.routes[0].legs[0].startLocation.latLng.longitude,
    };

    const destination = {
      latitude: route.routes[0].legs[0].endLocation.latLng.latitude,
      longitude: route.routes[0].legs[0].endLocation.latLng.longitude,
    };

    const drivers = await showDriversAvailable(distanceMeters);
    if (drivers.length === 0) return 404;
    const driversList = drivers.map((driver) => ({
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

    const response = {
      origin,
      destination,
      distance: distanceMeters / 1000,
      duration,
      options: driversList,
      routeResponse: route,
    };

    return response;
  } catch (error: any) {
    return { message: (error as Error).message };
  }
};

export const confirmRide = async (ride: RideType) => {
  try {
    const driver = await getDriverByIdAndName(ride.driver.id, ride.driver.name);
    if (!driver) return 404;
    if (ride.distance < driver.minKm) return 406;
    Ride.create({
      driverId: ride.driver.id,
      customerId: ride.customer_id,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      value: ride.value,
      date: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { message: (error as Error).message };
  }
};

export const showRides = async (customerId: number, driverId?: number) => {
  try {
    if (driverId) {
      const driver = await getDriverById(driverId);
      if (!driver) return 400;
      const rides = await Ride.findAll({
        where: { customerId, driverId },
        include: [{ model: Driver, as: "driver" }],
      });
      if (rides.length === 0) return 404;
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
        customer_id: customerId,
        rides: ridesList,
      };
      return response;
    }
    const rides = await Ride.findAll({
      where: { customerId },
      include: [{ model: Driver, as: "driver" }],
    });
    if (rides.length === 0) return 404;
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
    return response;
  } catch (error: any) {
    return { message: (error as Error).message };
  }
};
