import type { ClimatePeriod } from "../../types/climate";

const label = (p: ClimatePeriod) => `${p.start}-${p.end}`;

/** Couleurs de la frise : fond, texte, bordure */
const TODAY = { bg: "#f1efe8", text: "#444441", border: "#888780" };
const LESS = { bg: "#EAF3DE", text: "#27500A", border: "#639922" };
const MORE = { bg: "#FCEBEB", text: "#791F1F", border: "#E24B4A" };

/**
 * « Frise des périodes » : le manque d'eau moyen par an de chaque période,
 * comparé à AUJOURD'HUI (la période réelle) : gris pour aujourd'hui, vert
 * s'il manquera moins d'eau, rouge s'il en manquera plus. Aucun seuil
 * ajouté : la seule référence est la période réelle. Sous chaque période,
 * son interprétation en mots simples, calculée par le back.
 */
export default function ClimatePeriods({ periods }: { periods: ClimatePeriod[] }) {
  const today = periods.find((p) => p.real) ?? null;
  const colors = (p: ClimatePeriod) =>
    p.real || !today || p.deficit === today.deficit ? TODAY : p.deficit < today.deficit ? LESS : MORE;

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Manque d'eau par période, comparé à aujourd'hui</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12, color: "#4b5563", marginBottom: 8 }}>
        {[[TODAY, "Aujourd'hui"], [LESS, "Moins de manque qu'aujourd'hui"], [MORE, "Plus de manque qu'aujourd'hui"]].map(([c, text]) => (
          <span key={text as string}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: (c as typeof TODAY).border, marginRight: 5 }} />
            {text as string}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(periods.length, 1)}, minmax(0, 1fr))`, gap: 8 }}>
        {periods.map((p) => {
          const c = colors(p);
          return (
            <div key={label(p)} style={{ minWidth: 0 }}>
              <div style={{ background: c.bg, borderRadius: 8, borderTop: `3px solid ${c.border}`, padding: "9px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 12.5, color: c.text }}>
                  {label(p)} · {p.real ? "réel" : "projeté"}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: c.text }}>
                  {Math.round(p.deficit).toLocaleString("fr-FR")} mm
                </div>
                <div style={{ fontSize: 11.5, color: c.text }}>manquants par an</div>
              </div>
              <div style={{ padding: "8px 2px 0" }}>
                {p.interpretation.map((line) => (
                  <p
                    key={line}
                    style={{
                      fontSize: 12.5, lineHeight: 1.5, margin: "0 0 4px",
                      color: line.startsWith("Attention") ? "#854F0B" : "#374151",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}