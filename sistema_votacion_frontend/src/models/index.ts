// Modelos y funciones utilitarias para manejar datos

import { CandidatoData, ResultadosData, VotanteData } from "../types";
import { CHART_COLORS } from "./constants";

export class VotanteModel {
  static fromApi(data: any): VotanteData {
    return {
      id: data.id || "",
      ci: data.ci || "",
      nombre: data.nombre || "",
      apellido: data.apellido || "",
      mesa_id: data.mesa_id || "",
    };
  }

  static getDisplayName(votante: VotanteData): string {
    return `${votante.nombre} ${votante.apellido}`.trim();
  }

  static isValid(votante: VotanteData): boolean {
    return !!(votante.ci && votante.nombre && votante.apellido);
  }
}

export class CandidatoModel {
  static fromApi(data: any): CandidatoData {
    return {
      id: data.id || 0,
      nombre: data.nombre || "",
      partido: data.partido || "",
      cargo: data.cargo || "",
      color: data.color || "#6B7280",
    };
  }

  static getInitials(candidato: CandidatoData): string {
    return candidato.nombre
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  static getDisplayInfo(candidato: CandidatoData): string {
    return `${candidato.nombre} (${candidato.partido})`;
  }

  static groupByCargo(
    candidatos: CandidatoData[]
  ): Record<string, CandidatoData[]> {
    return candidatos.reduce((grupos, candidato) => {
      if (!grupos[candidato.cargo]) {
        grupos[candidato.cargo] = [];
      }
      grupos[candidato.cargo].push(candidato);
      return grupos;
    }, {} as Record<string, CandidatoData[]>);
  }

  static sortByName(candidatos: CandidatoData[]): CandidatoData[] {
    return [...candidatos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
}

export class ResultadosModel {
  static fromApi(data: any): ResultadosData {
    return {
      candidato_id: data.candidato_id || 0,
      candidato_nombre: data.candidato_nombre || "",
      candidato_partido: data.candidato_partido || "",
      candidato_color: data.candidato_color || "#6B7280",
      total_votos: data.total_votos || 0,
    };
  }

  static getTotalVotos(resultados: ResultadosData[]): number {
    return resultados.reduce(
      (total, resultado) => total + resultado.total_votos,
      0
    );
  }

  static getPorcentaje(resultado: ResultadosData, total: number): number {
    if (total === 0) return 0;
    return Math.round((resultado.total_votos / total) * 100 * 100) / 100;
  }

  static sortByVotos(resultados: ResultadosData[]): ResultadosData[] {
    return [...resultados].sort((a, b) => b.total_votos - a.total_votos);
  }

  static getChartData(resultados: ResultadosData[]) {
    const sortedResults = this.sortByVotos(resultados);

    return {
      labels: sortedResults.map((r) => r.candidato_nombre),
      datasets: [
        {
          data: sortedResults.map((r) => r.total_votos),
          backgroundColor: sortedResults.map(
            (r, index) =>
              r.candidato_color || CHART_COLORS[index % CHART_COLORS.length]
          ),
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    };
  }

  static getTopCandidatos(
    resultados: ResultadosData[],
    limit: number = 3
  ): ResultadosData[] {
    return this.sortByVotos(resultados).slice(0, limit);
  }
}

export class Mesa {
  static getId(numero: string | number): string {
    return String(numero);
  }

  static getNombre(id: string): string {
    return `Mesa ${id}`;
  }

  static isValidId(id: string): boolean {
    return ["1", "2", "3", "4"].includes(id);
  }

  static getRoomName(id: string): string {
    return `mesa_${id}`;
  }
}

export class ValidationHelper {
  static isValidCI(ci: string): boolean {
    const cleaned = ci.trim();
    return (
      cleaned.length >= 6 && cleaned.length <= 15 && /^[0-9]+$/.test(cleaned)
    );
  }

  static formatCI(ci: string): string {
    return ci.trim().replace(/\D/g, "");
  }

  static isValidColor(color: string): boolean {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  }
}

export class TimeHelper {
  static formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "Hora no disponible";
    }
  }

  static formatDate(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "Fecha no disponible";
    }
  }

  static formatDateTime(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha y hora no disponibles";
    }
  }
}

// Re-exportar constantes para facilitar el acceso
export * from "./constants";
