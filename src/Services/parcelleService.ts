import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const BASE_URL = `${API_BASE}/api/parcelles`;   // ✅ /api/parcelles

export const parcelleService = {
  async list() {
    const { data } = await axios.get(BASE_URL, { withCredentials: true });
    return data;
  },

  async create(payload: { nom: string; geometry: any }) {
    const { data } = await axios.post(BASE_URL, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  async update(id: number, payload: { nom?: string; geometry?: any }) {
    const { data } = await axios.patch(`${BASE_URL}/${id}`, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  async delete(id: number) {
    await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
  },
};