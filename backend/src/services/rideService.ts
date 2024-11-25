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
