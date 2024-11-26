import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/axios";
import { ICustomer, IDriver } from "../types";

type Prop = {
  page: "Home" | "Rides";
};

export const useCustomersAndDrivers = ({ page }: Prop) => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [drivers, setDrivers] = useState<IDriver[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/customer");
        setCustomers(response.data);
      } catch {
        toast.error("Erro ao carregar usuários");
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await api.get("/driver");
        setDrivers(response.data);
      } catch {
        toast.error("Erro ao carregar motoristas");
      }
    };

    fetchCustomers();
    if (page === "Rides") fetchDrivers();
  }, []);

  return { customers, drivers };
};
