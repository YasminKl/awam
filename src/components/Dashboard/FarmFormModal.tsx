import { useEffect, useRef, useState } from "react";
import { farmService } from "../../Services/farmService";
import { useToast } from "../../hooks/useToast";
import { geocodeSearch, type GeocodingResult } from "../../utils/geocode";
import type { Farm } from "../../types/farm";
import Dialog from "../Common/Dialog";
import { dialogButton, dialogInput, dialogLabel } from "../Common/dialogStyles";
import BusyLabel from "../Common/BusyLabel";


interface FarmFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm?: Farm | null;
  onSaved: (farmId: number) => void | Promise<void>;
}

const EMPTY = { name: "", location: "" };

/**
 * Création / modification d'une ferme, dans la fenêtre claire commune.
 * La position (latitude, longitude) sert à la météo du tableau de bord.
 * Le lieu se choisit dans les propositions de la recherche, comme dans la
 * barre de recherche de la carte : la position est celle du lieu choisi,
 * jamais devinée à partir d'un texte qui pourrait être mal écrit.
 */
export default function FarmFormModal({ isOpen, onClose, farm = null, onSaved }: FarmFormModalProps) {
  const isEdit = Boolean(farm);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Recherche du lieu, comme la barre de recherche de la carte
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  /** Position du lieu choisi dans la liste ; null tant qu'aucun lieu n'est choisi */
  const [picked, setPicked] = useState<{ lat: number; lon: number } | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setForm(farm ? { name: farm.name, location: farm.location ?? "" } : EMPTY);
    setResults([]);
    setShowResults(false);
    // Ferme existante : son lieu et sa position actuels restent valables
    setPicked(farm?.latitude != null && farm?.longitude != null ? { lat: farm.latitude, lon: farm.longitude } : null);
  }, [isOpen, farm]);

  const handleLocationChange = (value: string) => {
    setForm((f) => ({ ...f, location: value }));
    setPicked(null); // le texte change : un lieu doit être choisi de nouveau
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!value.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const found = await geocodeSearch(value);
        setResults(found);
        setShowResults(true);
      } catch (err) {
        console.error(err);
      }
    }, 400);
  };

  const handleSelectResult = (result: GeocodingResult) => {
    // Même limite que la base (255 caractères) pour le nom du lieu
    setForm((f) => ({ ...f, location: result.label.slice(0, 255) }));
    setPicked({ lat: result.lat, lon: result.lon });
    setShowResults(false);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError("Le nom de la ferme est requis.");
      return;
    }

    const location = form.location.trim();
    if (location && !picked) {
      setError("Choisissez le lieu dans la liste des propositions.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      // Position du lieu choisi dans la liste ; sans lieu, la position actuelle est gardée
      const payload = {
        name,
        location: location || null,
        latitude: location ? picked!.lat : farm?.latitude ?? null,
        longitude: location ? picked!.lon : farm?.longitude ?? null,
      };

      const saved = isEdit
        ? await farmService.update(farm!.id, payload)
        : await farmService.create(payload);

      showToast("success", isEdit ? "Ferme modifiée avec succès." : "Ferme créée avec succès.");
      await onSaved(saved.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier la ferme" : "Nouvelle ferme"}
      subtitle={isEdit ? farm?.name : "Ses parcelles s'ajoutent ensuite sur la carte"}
      width={400}
      footer={
        <>
          <button type="button" onClick={onClose} disabled={submitting} style={dialogButton.secondary}>
            Annuler
          </button>
          <button type="submit" form="farm-form" disabled={submitting} style={dialogButton.primary}>
            <BusyLabel busy={submitting} text="Enregistrement…">{isEdit ? "Enregistrer" : "Créer"}</BusyLabel>
          </button>
        </>
      }
    >
      <form id="farm-form" onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={dialogLabel}>
          Nom de la ferme *
          <input
            autoFocus
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            disabled={submitting}
            maxLength={150}
            placeholder="Ex. Sidi Mechreg"
            style={dialogInput}
          />
        </label>

        <label style={dialogLabel}>
          Lieu <span style={{ color: "#9ca3af" }}>(facultatif)</span>
          <input
            value={form.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => results.length > 0 && !picked && setShowResults(true)}
            disabled={submitting}
            placeholder="Ex. Makthar, Siliana"
            autoComplete="off"
            style={dialogInput}
          />
          {showResults && results.length > 0 && (
            <div style={{ marginTop: 4, background: "#ffffff", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.18)", overflow: "hidden" }}>
              {results.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectResult(r)}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 11px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#374151", fontWeight: 400 }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
          {showResults && results.length === 0 && (
            <span style={{ display: "block", fontSize: 11.5, color: "#b91c1c", marginTop: 4 }}>
              Aucun lieu trouvé : vérifiez l'orthographe.
            </span>
          )}
          <span style={{ display: "block", fontSize: 11.5, color: "#6b7280", marginTop: 4 }}>
            Tapez le lieu, puis choisissez-le dans la liste : il sert à afficher la météo de la ferme.
          </span>
        </label>

        {error && <p style={{ fontSize: 12.5, color: "#b91c1c", margin: 0 }}>{error}</p>}
      </form>
    </Dialog>
  );
}