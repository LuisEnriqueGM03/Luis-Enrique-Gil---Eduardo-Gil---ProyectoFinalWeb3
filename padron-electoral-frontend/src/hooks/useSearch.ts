import { useState, useEffect, useMemo } from "react";
import { Votante } from "../models/Votante";

export const useSearch = (data: Votante[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Votante[]>([]);

  const filteredVotantes = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    return data.filter(
      (votante) =>
        votante.nombre_completo
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        votante.ci.includes(searchTerm) ||
        votante.recinto_nombre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        votante.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  useEffect(() => {
    setFilteredData(filteredVotantes);
  }, [filteredVotantes]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
    hasResults: filteredData.length > 0,
    totalResults: filteredData.length,
  };
};
