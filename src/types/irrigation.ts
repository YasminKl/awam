/** Irrigation : api/routes/irrigation.py */

export type EquipmentKind = "arrosoir" | "tuyau" | "goutte_a_goutte";
export type WaterSource = "puits" | "reseau" | "bassin" | "autre";

export interface Equipment {
  id: number;
  parcel_id: number;
  name: string;
  kind: EquipmentKind;
  crop_ids: number[];
  /** Cultures desservies, avec leur nom lisible */
  crops: { id: number; label: string }[];
  water_source: WaterSource;
  has_meter: boolean;
  can_capacity_l: number | null;
  hose_flow_l_min: number | null;
  hose_diameter_in: number | null;
  hose_length_m: number | null;
  emitter_flow_l_h: number | null;
  emitters_per_plant: number | null;
  plant_spacing_m: number | null;
  row_spacing_m: number | null;
  efficiency_pct: number | null;
  active: boolean;
  notes: string | null;
  /** Calculés par le back */
  plants_per_ha: number | null;
  flow_per_plant_l_h: number | null;
  total_flow_l_h: number | null;
}

export type EquipmentPayload = Partial<
  Omit<Equipment, "id" | "crops" | "plants_per_ha" | "flow_per_plant_l_h" | "total_flow_l_h">
>;