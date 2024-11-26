import { useState, useEffect } from "react";
import { api } from "./services/axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ICustomer } from "./types";
import axios from "axios";

function App() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [rideData, setRideData] = useState({
    customer_id: "0",
    origin: "",
    destination: "",
  });

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
      const response = await api.post("/ride/estimate", rideData);
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <Container>
      <h1>Solicite sua viagem</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Quem realizará a viagem?</Form.Label>
          <Form.Select name="customer_id" onChange={handleInputChange}>
            <option value="0">Escolha um usuário</option>
            {customers.map((customer: ICustomer) => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Digite o endereço de origem: </Form.Label>
          <Form.Control type="text" placeholder="Origem" name="origin" onChange={handleInputChange}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Digite o endereço de destino: </Form.Label>
          <Form.Control type="text" placeholder="Destino" name="destination" onChange={handleInputChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default App;
