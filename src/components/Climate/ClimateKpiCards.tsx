import type { ClimateSummary } from "../../types/climate";

interface Card {
  label: string;
  now: number | null;
  later: number | null;
  unit: string;
  digits: number;
  /** Une évolution dans ce sens est défavorable : elle s'affiche en rouge */
  badWhen: "up" | "down";
  /** Écart affiché en pourcentage (vrai) ou dans l'unité (faux) */
  percent: boolean;
}

const fmt = (v: number, digits: number) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/**
 * Chiffres clés : la valeur vers la fin de la projection, son évolution par
 * rapport à aujourd'hui (flèche, écart), et la valeur d'aujourd'hui. Le
 * manque d'eau vient des périodes calculées par le back (réelle, dernière).
 */
export default function ClimateKpiCards({ summary }: { summary: ClimateSummary }) {
  const k = summary.kpis;
  const realPeriod = summary.periods.find((p) => p.real) ?? null;
  const lastPeriod = summary.periods.length ? summary.periods[summary.periods.length - 1] : null;
  const cards: Card[] = [
    { label: "Pluie par an", now: k.rain.now, later: k.rain.future, unit: "mm", digits: 0, badWhen: "down", percent: true },
    { label: "Besoin en eau du climat", now: k.et0.now, later: k.et0.future, unit: "mm", digits: 0, badWhen: "up", percent: true },
    {
      label: "Manque d'eau par an",
      now: realPeriod?.deficit ?? null,
      later: lastPeriod && !lastPeriod.real ? lastPeriod.deficit : null,
      unit: "mm", digits: 0, badWhen: "up", percent: false,
    },
    { label: "Sol en été", now: k.summer_soil.now, later: k.summer_soil.future, unit: "°C", digits: 1, badWhen: "up", percent: false },
  ];
  if (k.sea) cards.push({ label: "Mer", now: k.sea.now, later: k.sea.future, unit: "°C", digits: 1, badWhen: "up", percent: false });

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
        Vers {summary.future_period[1]}, par rapport à aujourd'hui
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        {cards.map((c) => {
          const delta = c.now !== null && c.later !== null ? c.later - c.now : null;
          const bad = delta !== null && (c.badWhen === "up" ? delta > 0 : delta < 0);
          const arrow = delta === null || delta === 0 ? "→" : delta > 0 ? "↗" : "↘";
          const change =
            delta === null
              ? null
              : c.percent && c.now
                ? `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${fmt(Math.abs((delta / c.now) * 100), 0)} %`
                : `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${fmt(Math.abs(delta), c.digits)} ${c.unit}`;
          return (
            <div key={c.label} style={{ background: "#f6f7f6", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 12.5, color: "#6b7280" }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: "2px 0" }}>
                {c.later !== null ? `${fmt(c.later, c.digits)} ${c.unit}` : "—"}
              </div>
              <div style={{ fontSize: 12.5, color: bad ? "#A32D2D" : "#4b5563" }}>
                {change ? `${arrow} ${change}` : ""}
                {c.now !== null ? ` · ${fmt(c.now, c.digits)} aujourd'hui` : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}