import React, { useEffect, useState } from "react";
import { Votante } from "../models/Votante";
import { getVotantes, createVotante } from "../services/votanteService";
import { getRecintos } from "../services/recintoService";
import { Recinto } from "../models/Recinto";
import Navbar from "../components/common/Navbar";

const initialForm = {
  ci: '',
  nombre_completo: '',
  direccion: '',
  foto_carnet_anverso: null as File | null,
  foto_carnet_reverso: null as File | null,
  foto_votante: null as File | null,
  recinto_id_externo: '',
};

const VotantePage: React.FC = () => {
  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecintos = async () => {
      try {
        const data = await getRecintos();
        setRecintos(Array.isArray(data) ? data : []);
      } catch (err) {
        setRecintos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecintos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);
    try {
      if (!form.ci || !form.nombre_completo || !form.direccion || !form.recinto_id_externo) {
        setFormError('Por favor, completa todos los campos obligatorios.');
        setSubmitting(false);
        return;
      }
      const formData = new FormData();
      formData.append('ci', form.ci);
      formData.append('nombre_completo', form.nombre_completo);
      formData.append('direccion', form.direccion);
      formData.append('recinto_id_externo', form.recinto_id_externo);
      if (form.foto_carnet_anverso) formData.append('foto_carnet_anverso', form.foto_carnet_anverso);
      if (form.foto_carnet_reverso) formData.append('foto_carnet_reverso', form.foto_carnet_reverso);
      if (form.foto_votante) formData.append('foto_votante', form.foto_votante);
      await createVotante(formData);
      setForm(initialForm);
      setFormSuccess('Votante registrado exitosamente.');
    } catch (err) {
      setFormError('Error al registrar el votante.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-10 mt-6 mt-24">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Registrar Nuevo Votante</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad *</label>
              <input type="text" name="ci" value={form.ci} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ej: 12345678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
              <input type="text" name="nombre_completo" value={form.nombre_completo} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ej: Juan Pérez" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
              <textarea name="direccion" value={form.direccion} onChange={handleInputChange} required rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Dirección completa" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Carnet (Anverso)</label>
              <input type="file" name="foto_carnet_anverso" accept="image/*" onChange={handleFileChange} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Carnet (Reverso)</label>
              <input type="file" name="foto_carnet_reverso" accept="image/*" onChange={handleFileChange} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto del Votante</label>
              <input type="file" name="foto_votante" accept="image/*" onChange={handleFileChange} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recinto *</label>
              <select
                name="recinto_id_externo"
                value={form.recinto_id_externo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un recinto</option>
                {recintos.map((recinto) => (
                  <option key={recinto.id} value={recinto.id}>
                    {recinto.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{formError}</div>}
          {formSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{formSuccess}</div>}
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Registrando...' : 'Registrar Votante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VotantePage; 