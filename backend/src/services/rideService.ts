import { api } from "./axios";

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
    return route;
  } catch (error: any) {
    return { message: (error as Error).message };
  }
};
