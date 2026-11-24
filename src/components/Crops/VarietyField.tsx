import { useState } from "react";
import type { VarietyOption } from "../../types/crop";

const OTHER = "__autre__";
/** Même limite que la base (colonne crop.variety, 100 caractères) */
const MAX_LENGTH = 100;

interface VarietyFieldProps {
  /** Variétés proposées pour l'espèce ; vide = saisie libre directe */
  varieties: VarietyOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Choix de la variété d'une espèce.
 *
 * - Espèce avec variétés connues : liste regroupée par origine
 *   (tunisiennes, espagnoles, types cultivés) + « Autre… » pour saisir
 *   une variété absente de la liste.
 * - Espèce sans liste (caroubier) : saisie libre directe.
 */
export default function VarietyField({
  varieties,
  value,
  onChange,
  disabled = false,
  style,
}: VarietyFieldProps) {
  const names = varieties.map((v) => v.name);
  // Mode « Autre » : la valeur saisie n'est pas dans la liste
  const [other, setOther] = useState(value !== "" && !names.includes(value));
  // Limite atteinte : le champ s'arrête, un message l'explique
  const limitReached =
    value.length >= MAX_LENGTH ? (
      <span style={{ display: "block", fontSize: 11, color: "#b91c1c", marginTop: 3 }}>
        {MAX_LENGTH} caractères maximum.
      </span>
    ) : null;

  if (varieties.length === 0) {
    return (
      <>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Variété (facultatif)"
          maxLength={MAX_LENGTH}
          style={style}
        />
        {limitReached}
      </>
    );
  }

  if (other) {
    return (
      <>
      <div style={{ display: "flex", gap: 4 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Autre variété"
          maxLength={MAX_LENGTH}
          autoFocus
          style={{ ...style, flex: 1 }}
        />
        <button
          type="button"
          onClick={() => {
            setOther(false);
            onChange("");
          }}
          disabled={disabled}
          title="Revenir à la liste"
          style={{
            background: "transparent",
            border: "1px solid #d1d5db",
            borderRadius: 7,
            color: "#4b5563",
            padding: "0 8px",
            marginTop: 3,
            cursor: "pointer",
          }}
        >
          ↺
        </button>
      </div>
      {limitReached}
      </>
    );
  }

  // Regroupement par origine, dans l'ordre reçu du back
  const groups = varieties.reduce<{ label: string; items: VarietyOption[] }[]>(
    (acc, v) => {
      const group = acc.find((g) => g.label === v.origin_label);
      if (group) group.items.push(v);
      else acc.push({ label: v.origin_label, items: [v] });
      return acc;
    },
    []
  );

  return (
    <select
      value={value}
      onChange={(e) => {
        if (e.target.value === OTHER) {
          setOther(true);
          onChange("");
        } else {
          onChange(e.target.value);
        }
      }}
      disabled={disabled}
      style={style}
    >
      <option value="">Variété (facultatif)</option>
      {groups.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.items.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name}
            </option>
          ))}
        </optgroup>
      ))}
      <option value={OTHER}>Autre…</option>
    </select>
  );
}