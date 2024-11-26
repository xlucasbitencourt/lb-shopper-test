import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import { ICustomer, IDriver, IRideResponse } from "../types";
import axios from "axios";
import { toast } from "react-toastify";
import { useCustomersAndDrivers } from "../hooks/useCustomersAndDrivers";
import { formatDate, formatMoney, secondsToMinutesToHours } from "../utils";

export default function Rides() {
  const { customers, drivers } = useCustomersAndDrivers({ page: "Rides" });
  const [rideData, setRideData] = useState({
    customer_id: "0",
    driver_id: "0",
  });
  const [rides, setRides] = useState<IRideResponse>();

  const navigate = useNavigate();

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
      setRides(undefined);
      const pathQuery =
        rideData.driver_id === "0"
          ? rideData.customer_id
          : `${rideData.customer_id}?driver_id=${rideData.driver_id}`;
      const response = await api.get("/ride/" + pathQuery);
      setRides(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error_description);
      } else {
        toast.error("Erro ao buscar viagens");
      }
    }
  };

  return (
    <Container className="p-1">
      <Button variant="info" onClick={() => navigate("/")} className="w-100">
        Voltar para solicitação de viagem
      </Button>
      <h1>Histórico de viagens</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Escolha o usuário</Form.Label>
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
          <Form.Label>Escolha o motorista</Form.Label>
          <Form.Select defaultValue="0" name="driver_id" onChange={handleInputChange}>
            <option value="0">Todos</option>
            {drivers.map((driver: IDriver) => (
              <option key={driver.driverId} value={driver.driverId}>
                {driver.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button
          disabled={rideData.customer_id === "0"}
          size="lg"
          style={{ width: "100%" }}
          variant={rideData.customer_id === "0" ? "secondary" : "primary"}
          type="submit"
        >
          Exibir viagens
        </Button>
      </Form>
      {rides && (
        <Accordion className="mt-4">
          {rides?.rides.map((ride, index) => (
            <Accordion.Item key={ride.id} eventKey={index.toString()}>
              <Accordion.Header>
                {formatDate(ride.date)} - {formatMoney(ride.value)}
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Data:</strong> {formatDate(ride.date)}
                </p>
                <p>
                  <strong>Motorista:</strong> {ride.driver.name}
                </p>
                <p>
                  <strong>Origem:</strong> {ride.origin}
                </p>
                <p>
                  <strong>Destino:</strong> {ride.destination}
                </p>
                <p>
                  <strong>Distância:</strong> {ride.distance.toString().replace(".", ",")}{" "}
                  km
                </p>
                <p>
                  <strong>Duração:</strong> {secondsToMinutesToHours(ride.duration)}
                </p>
                <p>
                  <strong>Valor:</strong> {formatMoney(ride.value)}
                </p>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
}
