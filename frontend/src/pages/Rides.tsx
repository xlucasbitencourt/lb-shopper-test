import { useState, useEffect } from "react";
import { api } from "../services/axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ICustomer, IDriver, IRideResponse } from "../types";
import axios from "axios";
import { toast } from "react-toastify";
import { formatMoney } from "../utils";

export default function Rides() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [drivers, setDrivers] = useState<IDriver[]>([]);
  const [rideData, setRideData] = useState({
    customer_id: "0",
    driver_id: "0",
  });
  const [rides, setRides] = useState<IRideResponse>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomersAndDrivers = async () => {
      const response = await api.get("/customer");
      setCustomers(response.data);
      const responseDrivers = await api.get("/driver");
      setDrivers(responseDrivers.data);
    };

    fetchCustomersAndDrivers();
  }, []);

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
      setRides(undefined);
      const pathQuery =
        rideData.driver_id === "0"
          ? rideData.customer_id
          : `${rideData.customer_id}?driver_id=${rideData.driver_id}`;
      const response = await api.get("/ride/" + pathQuery);
      setRides(response.data);
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error_description);
      } else {
        toast.error("Erro ao buscar viagens");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
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
    </Container>
  );
}
