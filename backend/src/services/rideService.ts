import { api } from "./axios";
import { showDriversAvailable } from "./driverService";

export const getEstimateFromGoogle = async (places: {
  origin: string;
  destination: string;
}) => {
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

export const getEstimateDrivers = async (places: {
  origin: string;
  destination: string;
}) => {
  try {
    const route = await getEstimateFromGoogle(places);
    const { distanceMeters, duration } = route.routes[0];
    const drivers = await showDriversAvailable(distanceMeters);
    if (drivers.length === 0) return 404;
    return drivers;
  } catch (error: any) {
    return { message: (error as Error).message };
  }
};
