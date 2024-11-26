import { useEffect, useRef, useState } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

interface Props {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

export const MapWithRoute = ({ origin, destination }: Props) => {
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!directionsService.current) {
      directionsService.current = new google.maps.DirectionsService();
    }

    const calculateRoute = async () => {
      if (directionsService.current) {
        try {
          const result = await directionsService.current.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          });
          setDirections(result);
        } catch (error) {
          console.error("Error calculating directions:", error);
        }
      }
    };

    calculateRoute();
  }, [isLoaded, origin, destination]);

  if (loadError) {
    return <div>Erro ao carregar o mapa: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Carregando mapa</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "250px" }}
      center={origin}
      zoom={14}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};
