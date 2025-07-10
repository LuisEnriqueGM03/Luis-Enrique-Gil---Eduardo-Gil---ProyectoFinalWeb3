// Custom hook para manejar el estado y lógica de votación

import { useState, useEffect, useCallback } from "react";
import { socketService } from "../services/socket";
import { apiService } from "../services/api";
import { EstadoVotante, VotanteData, CandidatoData, MesaId } from "../types";
import { CandidatoModel } from "../models";

interface UseVotacionReturn {
  // Estado
  estado: EstadoVotante;
  mesaId: MesaId;
  votante: VotanteData | null;
  candidatos: CandidatoData[];
  candidatosSeleccionados: Record<string, CandidatoData>;
  mensaje: string;
  error: string;
  loading: boolean;
  showConfirmacion: boolean;

  // Acciones
  setMesaId: (id: MesaId) => void;
  seleccionarCandidato: (candidato: CandidatoData) => void;
  confirmarVoto: () => void;
  emitirVoto: () => void;
  cancelarVoto: () => void;
  cambiarSeleccion: () => void;
  reiniciar: () => void;

  // Utilidades
  getProgresoSeleccion: () => { seleccionados: number; total: number };
  getCargosDisponibles: () => string[];
  isVotacionCompleta: () => boolean;
}

export const useVotacion = (): UseVotacionReturn => {
  // Estados
  const [estado, setEstado] = useState<EstadoVotante>(
    EstadoVotante.ESPERANDO_HABILITACION
  );
  const [mesaId, setMesaId] = useState<MesaId>("1");
  const [votante, setVotante] = useState<VotanteData | null>(null);
  const [candidatos, setCandidatos] = useState<CandidatoData[]>([]);
  const [candidatosSeleccionados, setCandidatosSeleccionados] = useState<
    Record<string, CandidatoData>
  >({});
  const [mensaje, setMensaje] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false);

  // Configurar listeners de socket
  useEffect(() => {
    // Conectar socket
    socketService.connect();
    socketService.joinMesa(mesaId);

    // Listener para habilitar papeleta
    const unsubscribeHabilitar = socketService.onHabilitarPapeleta((data) => {
      setVotante(data.votante);
      setCandidatos(data.candidatos);
      setEstado(EstadoVotante.PAPELETA_HABILITADA);
      setMensaje(
        "✅ Papeleta habilitada. Selecciona un candidato para cada cargo."
      );
      setError("");
      setCandidatosSeleccionados({});
    });

    // Listener para voto exitoso
    const unsubscribeVotoExitoso = socketService.onVotoExitoso((data) => {
      setEstado(EstadoVotante.VOTO_EMITIDO);
      setMensaje(`✅ ${data.mensaje}`);
      setError("");
      setShowConfirmacion(false);
      setLoading(false);
    });

    // Listener para papeleta cerrada
    const unsubscribePapeletaCerrada = socketService.onPapeletaCerrada(
      (data) => {
        setEstado(EstadoVotante.VOTO_EMITIDO);
        setMensaje(`✅ ${data.mensaje}`);
        setError("");
        setShowConfirmacion(false);
        setLoading(false);
      }
    );

    // Listener para errores
    const unsubscribeError = socketService.onErrorVoto((data) => {
      setError(`❌ Error: ${data.error}`);
      setEstado(EstadoVotante.ERROR);
      setLoading(false);
      setShowConfirmacion(false);
    });

    // Cleanup
    return () => {
      unsubscribeHabilitar();
      unsubscribeVotoExitoso();
      unsubscribePapeletaCerrada();
      unsubscribeError();
    };
  }, [mesaId]);

  // Cambiar mesa
  const handleSetMesaId = useCallback(
    (id: MesaId) => {
      if (estado === EstadoVotante.ESPERANDO_HABILITACION) {
        setMesaId(id);
        socketService.joinMesa(id);
      }
    },
    [estado]
  );

  // Seleccionar candidato
  const seleccionarCandidato = useCallback(
    (candidato: CandidatoData) => {
      const nuevosSeleccionados = {
        ...candidatosSeleccionados,
        [candidato.cargo]: candidato,
      };
      setCandidatosSeleccionados(nuevosSeleccionados);

      // Verificar si se han seleccionado candidatos para todos los cargos
      const cargosDisponibles = Array.from(
        new Set(candidatos.map((c) => c.cargo))
      );
      const cargosSeleccionados = Object.keys(nuevosSeleccionados);

      if (cargosSeleccionados.length === cargosDisponibles.length) {
        setEstado(EstadoVotante.CANDIDATOS_SELECCIONADOS);
        setMensaje(
          "✅ Candidatos seleccionados para todos los cargos. Puedes confirmar tu voto."
        );
      } else {
        setMensaje(
          `Selecciona candidatos para ${
            cargosDisponibles.length - cargosSeleccionados.length
          } cargo(s) más.`
        );
      }
    },
    [candidatos, candidatosSeleccionados]
  );

  // Confirmar voto
  const confirmarVoto = useCallback(() => {
    const cargosDisponibles = Array.from(
      new Set(candidatos.map((c) => c.cargo))
    );
    const cargosSeleccionados = Object.keys(candidatosSeleccionados);

    if (cargosSeleccionados.length !== cargosDisponibles.length) {
      setError("Por favor selecciona un candidato para cada cargo");
      return;
    }

    setShowConfirmacion(true);
  }, [candidatos, candidatosSeleccionados]);

  // Emitir voto
  const emitirVoto = useCallback(() => {
    const cargosDisponibles = Array.from(
      new Set(candidatos.map((c) => c.cargo))
    );
    const cargosSeleccionados = Object.keys(candidatosSeleccionados);

    if (cargosSeleccionados.length !== cargosDisponibles.length) {
      setError("Por favor selecciona un candidato para cada cargo");
      return;
    }

    setLoading(true);
    setError("");
    setEstado(EstadoVotante.CONFIRMANDO_VOTO);
    setMensaje("Emitiendo votos...");

    // Emitir todos los votos
    Object.values(candidatosSeleccionados).forEach((candidato) => {
      socketService.emitVoto(candidato.id, mesaId);
    });

    setShowConfirmacion(false);
  }, [candidatos, candidatosSeleccionados, mesaId]);

  // Cancelar voto
  const cancelarVoto = useCallback(() => {
    setShowConfirmacion(false);
  }, []);

  // Cambiar selección
  const cambiarSeleccion = useCallback(() => {
    setCandidatosSeleccionados({});
    setEstado(EstadoVotante.PAPELETA_HABILITADA);
    setMensaje(
      "✅ Papeleta habilitada. Selecciona un candidato para cada cargo."
    );
    setError("");
  }, []);

  // Reiniciar
  const reiniciar = useCallback(() => {
    setEstado(EstadoVotante.ESPERANDO_HABILITACION);
    setVotante(null);
    setCandidatos([]);
    setCandidatosSeleccionados({});
    setMensaje("");
    setError("");
    setShowConfirmacion(false);
    setLoading(false);
  }, []);

  // Utilidades
  const getProgresoSeleccion = useCallback(() => {
    const cargosDisponibles = Array.from(
      new Set(candidatos.map((c) => c.cargo))
    );
    const cargosSeleccionados = Object.keys(candidatosSeleccionados);
    return {
      seleccionados: cargosSeleccionados.length,
      total: cargosDisponibles.length,
    };
  }, [candidatos, candidatosSeleccionados]);

  const getCargosDisponibles = useCallback(() => {
    return Array.from(new Set(candidatos.map((c) => c.cargo)));
  }, [candidatos]);

  const isVotacionCompleta = useCallback(() => {
    const cargosDisponibles = getCargosDisponibles();
    const cargosSeleccionados = Object.keys(candidatosSeleccionados);
    return cargosSeleccionados.length === cargosDisponibles.length;
  }, [getCargosDisponibles, candidatosSeleccionados]);

  return {
    // Estado
    estado,
    mesaId,
    votante,
    candidatos,
    candidatosSeleccionados,
    mensaje,
    error,
    loading,
    showConfirmacion,

    // Acciones
    setMesaId: handleSetMesaId,
    seleccionarCandidato,
    confirmarVoto,
    emitirVoto,
    cancelarVoto,
    cambiarSeleccion,
    reiniciar,

    // Utilidades
    getProgresoSeleccion,
    getCargosDisponibles,
    isVotacionCompleta,
  };
};
