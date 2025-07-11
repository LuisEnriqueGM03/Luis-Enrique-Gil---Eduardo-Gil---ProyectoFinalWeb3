import { useState, useEffect } from "react";
import { getVotantes, createVotante, updateVotante, deleteVotante } from "../services/votanteService";
import { Votante } from "../models/Votante";

export const useVotantes = () => {
  const [votantes, setVotantes] = useState<Votante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVotantes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getVotantes();
      setVotantes(data);
    } catch (err) {
      setError("Error al cargar la lista de votantes");
      console.error("Error loading votantes:", err);
    } finally {
      setLoading(false);
    }
  };

  const createVotanteHandler = async (formData: FormData) => {
    try {
      const newVotante = await createVotante(formData);
      setVotantes((prev) => [...prev, newVotante]);
      return newVotante;
    } catch (error) {
      throw error;
    }
  };

  const updateVotanteHandler = async (id: number, formData: FormData) => {
    try {
      const updatedVotante = await updateVotante(id, formData);
      setVotantes((prev) =>
        prev.map((v) => (v.id === id ? updatedVotante : v))
      );
      return updatedVotante;
    } catch (error) {
      throw error;
    }
  };

  const deleteVotanteHandler = async (id: number) => {
    try {
      await deleteVotante(id);
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
    createVotante: createVotanteHandler,
    updateVotante: updateVotanteHandler,
    deleteVotante: deleteVotanteHandler,
  };
};
