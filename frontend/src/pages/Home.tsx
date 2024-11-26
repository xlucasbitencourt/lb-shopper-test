import { useState, useEffect } from "react";
import { api } from "../services/axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ICustomer } from "../types";
import axios from "axios";

export default function Home() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [rideData, setRideData] = useState({
    customer_id: "0",
    origin: "",
    destination: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await api.get("/customer");
      setCustomers(response.data);
      console.log(response.data);
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    console.log(rideData);
  }, [rideData]);

  const handleDisableButton = () => {
    if (loading) {
      return true;
    }

    if (
      rideData.customer_id === "0" ||
      rideData.origin.length < 3 ||
      rideData.destination.length < 3
    ) {
      return true;
    }

    return false;
  };

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
    console.log(rideData);
    try {
      setLoading(true);
      const response = await api.post("/ride/estimate", rideData);
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
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
          Calcular viagem
        </Button>
      </Form>
    </Container>
  );
}
