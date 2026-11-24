import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ClimateYear } from "../../types/climate";

const REAL = "#e34948";
const PROJECTED = "#f09595";
const SURPLUS = "#2a78d6";

/**
 * « Manque d'eau chaque année » : pluie moins besoin en eau du climat. Les
 * années réelles utilisent la météo mesurée, les suivantes la projection ;
 * une barre sous zéro est un manque, au-dessus un excédent.
 */
export default function ClimateDeficitChart({ years }: { years: ClimateYear[] }) {
  const data = years
    .map((y) => {
      const real = y.rain_real !== null && y.et0_real !== null;
      const rain = real ? y.rain_real : y.rain_projected;
      const et0 = real ? y.et0_real : y.et0_projected;
      return rain === null || et0 === null ? null : { name: String(y.year), balance: Math.round(rain - et0), real };
    })
    .filter((d): d is { name: string; balance: number; real: boolean } => d !== null);

  const legend = (color: string, text: string) => (
    <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: color, marginRight: 5 }} />{text}</span>
  );
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Manque d'eau chaque année : pluie moins besoin</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12, color: "#4b5563", marginBottom: 6 }}>
        {legend(REAL, "Années réelles")}
        {legend(PROJECTED, "Projection")}
        {legend(SURPLUS, "Année excédentaire")}
        <span style={{ marginLeft: "auto", color: "#9ca3af" }}>en mm</span>
      </div>
      <div style={{ width: "100%", height: 230 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#eef0ee" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4b5563" }} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={40} />
            <YAxis tick={{ fontSize: 11, fill: "#898781" }} tickLine={false} axisLine={false} width={44} />
            <ReferenceLine y={0} stroke="#c3c2b7" />
            <Tooltip
              formatter={(value: number) => [`${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toLocaleString("fr-FR")} mm`, "Pluie − besoin"]}
              labelFormatter={(label: string, items) => `${label} · ${items?.[0]?.payload?.real ? "réel" : "projeté"}`}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar dataKey="balance" radius={[4, 4, 4, 4]} maxBarSize={22} isAnimationActive={false}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.balance >= 0 ? SURPLUS : d.real ? REAL : PROJECTED} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}