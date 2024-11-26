import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { formatMoney } from "../utils";
import { Option } from "../types";

type Props = {
  drivers: Option[];
  chooseDriver: (driver: Option) => void;
};

export const DriversList = ({ drivers, chooseDriver }: Props) => {
  return (
    <ListGroup as="ol" numbered>
      {drivers.map((driver: Option) => (
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
  );
};
