import { useCallback, useEffect, useState } from "react";
import { parcelAnalysisService } from "../../Services/parcelAnalalysisService";
import { useToast } from "../../hooks/useToast";
import Dialog from "../Common/Dialog";
import { dialogButton } from "../Common/dialogStyles";
import AnalysisFields, {
  EMPTY_ANALYSIS_FORM,
  isAnalysisEmpty,
  toAnalysisPayload,
  type AnalysisFormState,
} from "./AnalysisFields";
import type { ParcelAnalysis } from "../../types/parcelAnalysis";

interface ParcelAnalysisPanelProps {
  parcelId: number;
}

/** Étiquettes : vert pour le sol, bleu pour l'eau */
const SOIL_CHIP = { background: "#EAF3DE", color: "#27500A" };
const WATER_CHIP = { background: "#E6F1FB", color: "#0C447C" };
const chipStyle: React.CSSProperties = { fontSize: 11.5, borderRadius: 999, padding: "2px 9px", whiteSpace: "nowrap" };
const linkButton: React.CSSProperties = {
  border: "none", background: "transparent", padding: 0, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
};

const fmt = (v: number | null | undefined, unit = "") =>
  v == null ? "—" : `${v.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}${unit}`;

/** Valeurs d'une analyse en étiquettes : seulement celles qui sont renseignées */
function chipsOf(a: ParcelAnalysis): { text: string; tone: React.CSSProperties }[] {
  const list: { text: string; tone: React.CSSProperties }[] = [];
  if (a.soil_ph != null) list.push({ text: `pH ${fmt(a.soil_ph)}`, tone: SOIL_CHIP });
  if (a.soil_organic_matter_pct != null) list.push({ text: `MO ${fmt(a.soil_organic_matter_pct, " %")}`, tone: SOIL_CHIP });
  if (a.soil_humidity_pct != null) list.push({ text: `Humidité ${fmt(a.soil_humidity_pct, " %")}`, tone: SOIL_CHIP });
  if (a.soil_salinity_g_l != null) list.push({ text: `Salinité ${fmt(a.soil_salinity_g_l, " g/L")}`, tone: SOIL_CHIP });
  if (a.water_ph != null) list.push({ text: `Eau pH ${fmt(a.water_ph)}`, tone: WATER_CHIP });
  if (a.water_nitrates_mg_l != null) list.push({ text: `Nitrates ${fmt(a.water_nitrates_mg_l, " mg/L")}`, tone: WATER_CHIP });
  return list;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR");

/**
 * Analyses de laboratoire de la parcelle, dans la fiche.
 *
 * La fiche n'affiche qu'un RÉSUMÉ compact : la dernière analyse en petites
 * étiquettes (vert : sol ; bleu : eau) et sa date. « + Ajouter » ouvre une
 * fenêtre claire : la fiche garde toujours la même hauteur. Les analyses
 * plus anciennes restent enregistrées dans la base.
 */
export default function ParcelAnalysisPanel({ parcelId }: ParcelAnalysisPanelProps) {
  const { showToast } = useToast();
  const [analyses, setAnalyses] = useState<ParcelAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  /** Fenêtre d'ajout d'une analyse, ouverte ou non */
  const [dialog, setDialog] = useState<"add" | null>(null);
  const [form, setForm] = useState<AnalysisFormState>(EMPTY_ANALYSIS_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAnalyses(await parcelAnalysisService.listByParcel(parcelId));
    } catch (e) {
      showToast("error", e instanceof Error ? e.message : "Analyses indisponibles.");
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  }, [parcelId, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (isAnalysisEmpty(form)) {
      showToast("error", "Renseignez au moins une valeur.");
      return;
    }
    setSaving(true);
    try {
      await parcelAnalysisService.create(parcelId, toAnalysisPayload(form));
      showToast("success", "Analyse enregistrée.");
      setForm(EMPTY_ANALYSIS_FORM);
      setDialog(null);
      await load();
    } catch (e) {
      showToast("error", e instanceof Error ? e.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  const latest = analyses[0];

  return (
    <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 10, paddingTop: 10, fontFamily: "system-ui, sans-serif" }}>
      {/* Résumé compact : la fiche garde toujours la même hauteur */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Sol et eau</span>
        {latest && <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{fmtDate(latest.analyzed_at)}</span>}
      </div>

      {loading && !latest ? (
        <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "6px 0 0" }}>Chargement…</p>
      ) : latest ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: "8px 0" }}>
          {chipsOf(latest).map((c) => (
            <span key={c.text} style={{ ...chipStyle, ...c.tone }}>{c.text}</span>
          ))}
          {latest.soil_type && <span style={{ ...chipStyle, ...SOIL_CHIP }}>{latest.soil_type}</span>}
        </div>
      ) : (
        <p style={{ fontSize: 12.5, color: "#6b7280", margin: "6px 0 8px" }}>Aucune analyse enregistrée.</p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <button type="button" onClick={() => setDialog("add")} style={{ ...linkButton, color: "#3B6D11", fontWeight: 600 }}>
          ＋ Ajouter
        </button>
      </div>

      {/* Fenêtre : nouvelle analyse */}
      <Dialog
        isOpen={dialog === "add"}
        onClose={() => setDialog(null)}
        title="Nouvelle analyse"
        subtitle="Sol et eau d'irrigation · tous les champs sont facultatifs"
        footer={
          <>
            <button type="button" onClick={() => setDialog(null)} disabled={saving} style={dialogButton.secondary}>
              Annuler
            </button>
            <button type="button" onClick={handleSave} disabled={saving} style={dialogButton.primary}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </>
        }
      >
        <AnalysisFields form={form} onChange={setForm} disabled={saving} />
      </Dialog>
    </div>
  );
}