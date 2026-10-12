export type Level = "green" | "yellow" | "red";
export type Severity = "normal" | "watch" | "alert" | "strong_alert";

/** Un indice déjà évalué par le back : le front n'applique aucun seuil. */
export interface Indicator {
  name: string;
  value: number;
  delta?: number | null;
  level: Level;
  threshold_label: string;
}

export interface Risk {
  severity: Severity;
  diagnosis: string;
  /** Ce qu'il faut mesurer sur le terrain */
  measure: string;
  /** Ce qu'il faut faire si l'anomalie est confirmée */
  action: string;
}

export interface StageInfo {
  stage?: string | null;
  label: string;
  period: string;
  days_since_planting?: number | null;
}

export interface Diagnosis {
  crop_id: number;
  scene_date?: string | null;
  stage: StageInfo;
  indicators: Indicator[];
  risks: Risk[];
  reading: string;
  /** Vrai si une coupe ou récolte explique les baisses : pas d'alerte */
  cultural_drop: boolean;
  severity: Severity;
}

export interface StageTimelineItem {
  stage: string;
  label: string;
  period: string;
  is_current: boolean;
  cultural_drop: boolean;
}

export interface WaterNeed {
  days: number;
  et0_mm: number;
  kc?: number | null;
  etc_mm: number;
  rain_mm: number;
  effective_rain_mm: number;
  net_need_mm: number;
  net_need_m3?: number | null;
  message: string;
}

export interface SoilRow {
  param: string;
  value: number;
  level: Level;
  reference: string;
  message: string;
}

export interface CropNeeds {
  crop_id: number;
  water?: WaterNeed | null;
  soil: SoilRow[];
  soil_analysis_date?: string | null;
}