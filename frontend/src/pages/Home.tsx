import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ICustomer, IEstimatedRide, Option } from "../types";
import axios from "axios";
import { toast } from "react-toastify";
import { MapWithRoute } from "../components/MapWithRoute";
import { useCustomersAndDrivers } from "../hooks/useCustomersAndDrivers";
import { DriversList } from "../components/DriversList";

const INITIAL_RIDE_DATA = {
  customer_id: "0",
  origin: "",
  destination: "",
};

export default function Home() {
  const { customers } = useCustomersAndDrivers({ page: "Home" });
  const [rideData, setRideData] = useState(INITIAL_RIDE_DATA);
  const [rideChosen, setRideChosen] = useState(INITIAL_RIDE_DATA);
  const [loading, setLoading] = useState(false);
  const [estimatedRide, setEstimatedRide] = useState<IEstimatedRide>();

  const navigate = useNavigate();

  const handleDisableButton = () =>
    loading ||
    rideData.customer_id === "0" ||
    rideData.origin.length < 3 ||
    rideData.destination.length < 3;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRideData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setEstimatedRide(undefined);
      const response = await api.post("/ride/estimate", rideData);
      setEstimatedRide({ ...response.data, rideData });
      setRideChosen(rideData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error_description);
      } else {
        toast.error("Erro ao calcular viagem");
      }
    } finally {
      setLoading(false);
    }
  };

  const chooseDriver = async (driver: Option) => {
    if (!estimatedRide) return toast.error("Calcule a rota novamente");
    try {
      const body = {
        ...rideChosen,
        distance: estimatedRide?.distance,
        duration: estimatedRide?.duration,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
      };
      await api.patch("/ride/confirm", body);
      setEstimatedRide(undefined);
      setRideData(INITIAL_RIDE_DATA);
      toast.success("Viagem solicitada com sucesso");
      navigate("/rides");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error_description);
      } else {
        toast.error("Erro ao solicitar viagem");
      }
    }
  };

  return (
    <Container>
      <Button onClick={() => navigate("/rides")} variant="info" className="w-100">
        Ir para viagens
      </Button>
      <h1>Solicite sua viagem</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Quem realizará a viagem?</Form.Label>
          <Form.Select defaultValue="0" name="customer_id" onChange={handleInputChange}>
            <option disabled value="0">
              Escolha um usuário
            </option>
            {customers.map((customer: ICustomer) => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Digite o endereço de origem: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Origem"
            name="origin"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Digite o endereço de destino: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Destino"
            name="destination"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button
          disabled={handleDisableButton()}
          size="lg"
          style={{ width: "100%" }}
          variant={handleDisableButton() ? "secondary" : "primary"}
          type="submit"
        >
          {estimatedRide ? "Recalcular viagem" : "Calcular viagem"}
        </Button>
      </Form>
      {estimatedRide && (
        <div>
          <MapWithRoute
            origin={{
              lat: estimatedRide.origin.latitude,
              lng: estimatedRide.origin.longitude,
            }}
            destination={{
              lat: estimatedRide.destination.latitude,
              lng: estimatedRide.destination.longitude,
            }}
          />
          <h2>Motoristas disponíveis:</h2>
          <DriversList drivers={estimatedRide.options} chooseDriver={chooseDriver} />
        </div>
      )}
    </Container>
  );
}
