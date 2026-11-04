import { api } from "./api";
import type { Equipment, EquipmentPayload } from "../types/irrigation";

// api/routes/irrigation.py, monté sous /api
export const irrigationService = {
  /** Équipements d'une parcelle : en service d'abord */
  listEquipment: (parcelId: number): Promise<Equipment[]> =>
    api.get<Equipment[]>(`/api/parcels/${parcelId}/equipment`),

  createEquipment: (payload: EquipmentPayload & { parcel_id: number; name: string; kind: string }): Promise<Equipment> =>
    api.post<Equipment>("/api/equipment", payload),

  updateEquipment: (id: number, payload: EquipmentPayload): Promise<Equipment> =>
    api.put<Equipment>(`/api/equipment/${id}`, payload),

  removeEquipment: (id: number): Promise<void> => api.delete<void>(`/api/equipment/${id}`),
};