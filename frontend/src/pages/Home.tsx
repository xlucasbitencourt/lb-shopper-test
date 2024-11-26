import { useState, useEffect } from "react";
import { api } from "../services/axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ICustomer, IEstimatedRide, Option } from "../types";
import axios from "axios";
import { toast } from "react-toastify";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { formatMoney } from "../utils";

export default function Home() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [rideData, setRideData] = useState({
    customer_id: "0",
    origin: "",
    destination: "",
  });
  const [rideChosen, setRideChosen] = useState({
    customer_id: "0",
    origin: "",
    destination: "",
  });
  const [loading, setLoading] = useState(false);
  const [estimatedRide, setEstimatedRide] = useState<IEstimatedRide>();

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await api.get("/customer");
      setCustomers(response.data);
    };

    fetchCustomers();
  }, []);

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
      const response = await api.patch("/ride/confirm", body);
      console.log(response);
      setEstimatedRide(undefined);
      setRideData({
        customer_id: "0",
        origin: "",
        destination: "",
      });
      toast.success("Viagem solicitada com sucesso");
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
      {estimatedRide && !loading && (
        <div>
          <h1>Motoristas disponíveis: </h1>
          <ListGroup as="ol" numbered>
            {estimatedRide &&
              estimatedRide.options.map((driver: Option) => (
                <ListGroup.Item as="li" key={driver.id}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto p-2">
                      <p className="fw-bold">{driver.name}</p>
                      <p>{driver.description}</p>
                      <p>Carro: {driver.vehicle}</p>
                    </div>
                    <div className="p-2 d-flex flex-column justify-content-between align-items-end">
                      <Badge bg="primary" pill>
                        {driver.review.rating}/5
                      </Badge>
                      <p>{driver.review.comments}</p>
                    </div>
                  </div>
                  <h5>Valor: {formatMoney(driver.value)}</h5>

                  <Button
                    onClick={() => chooseDriver(driver)}
                    variant="success"
                    className="w-100"
                    size="lg"
                  >
                    Escolher
                  </Button>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      )}
    </Container>
  );
}
