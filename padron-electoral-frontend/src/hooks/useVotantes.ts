import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { Votante } from "../types";

export const useVotantes = () => {
  const [votantes, setVotantes] = useState<Votante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVotantes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getVotantes();
      setVotantes(data);
    } catch (err) {
      setError("Error al cargar la lista de votantes");
      console.error("Error loading votantes:", err);
    } finally {
      setLoading(false);
    }
  };

  const createVotante = async (formData: FormData) => {
    try {
      const newVotante = await apiService.createVotante(formData);
      setVotantes((prev) => [...prev, newVotante]);
      return newVotante;
    } catch (error) {
      throw error;
    }
  };

  const updateVotante = async (id: number, formData: FormData) => {
    try {
      const updatedVotante = await apiService.updateVotante(id, formData);
      setVotantes((prev) =>
        prev.map((v) => (v.id === id ? updatedVotante : v))
      );
      return updatedVotante;
    } catch (error) {
      throw error;
    }
  };

  const deleteVotante = async (id: number) => {
    try {
      await apiService.deleteVotante(id);
      setVotantes((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    loadVotantes();
  }, []);

  return {
    votantes,
    loading,
    error,
    loadVotantes,
    createVotante,
    updateVotante,
    deleteVotante,
  };
};
