import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { Recinto } from "../types";

export const useRecintos = () => {
  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecintos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getRecintos();
      setRecintos(data);
    } catch (err) {
      setError("Error al cargar recintos");
      console.error("Error loading recintos:", err);
    } finally {
      setLoading(false);
    }
  };

  const createRecinto = async (recinto: Omit<Recinto, "id">) => {
    try {
      const newRecinto = await apiService.createRecinto(recinto);
      setRecintos((prev) => [...prev, newRecinto]);
      return newRecinto;
    } catch (error) {
      throw error;
    }
  };

  const updateRecinto = async (id: number, recinto: Partial<Recinto>) => {
    try {
      const updatedRecinto = await apiService.updateRecinto(id, recinto);
      setRecintos((prev) =>
        prev.map((r) => (r.id === id ? updatedRecinto : r))
      );
      return updatedRecinto;
    } catch (error) {
      throw error;
    }
  };

  const deleteRecinto = async (id: number) => {
    try {
      await apiService.deleteRecinto(id);
      setRecintos((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    loadRecintos();
  }, []);

  return {
    recintos,
    loading,
    error,
    loadRecintos,
    createRecinto,
    updateRecinto,
    deleteRecinto,
  };
};
