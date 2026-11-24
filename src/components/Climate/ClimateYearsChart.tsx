import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ClimateYear } from "../../types/climate";

const RAIN = "#2a78d6";
const DEMAND = "#eb6834";

/**
 * « Pluie et besoin en eau, année par année » : trait plein pour les années
 * réelles, pointillés pour la projection. Les deux tracés se rejoignent à la
 * dernière année réelle, pour lire la continuité.
 */
export default function ClimateYearsChart({ years }: { years: ClimateYear[] }) {
  const lastReal = years.filter((y) => y.rain_real !== null).map((y) => y.year).pop() ?? null;
  const data = years.map((y) => {
    const isReal = y.rain_real !== null;
    const join = y.year === lastReal;
    return {
      name: String(y.year),
      rainReal: y.rain_real,
      et0Real: y.et0_real,
      rainProj: join ? y.rain_real : isReal ? null : y.rain_projected,
      et0Proj: join ? y.et0_real : isReal ? null : y.et0_projected,
    };
  });
  const names: Record<string, string> = { rainReal: "Pluie réelle", rainProj: "Pluie projetée", et0Real: "Besoin réel", et0Proj: "Besoin projeté" };
  const legend = (color: string, dashed: boolean, text: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 18, borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}` }} />{text}
    </span>
  );
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Pluie et besoin en eau, année par année</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12, color: "#4b5563", marginBottom: 6 }}>
        {legend(RAIN, false, "Pluie réelle")}
        {legend(RAIN, true, "Pluie projetée")}
        {legend(DEMAND, false, "Besoin réel")}
        {legend(DEMAND, true, "Besoin projeté")}
        <span style={{ marginLeft: "auto", color: "#9ca3af" }}>en mm par an</span>
      </div>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#eef0ee" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4b5563" }} tickLine={false} axisLine={{ stroke: "#d1d5db" }} interval={0} angle={-45} textAnchor="end" height={40} />
            <YAxis tick={{ fontSize: 11, fill: "#898781" }} tickLine={false} axisLine={false} width={44} />
            <Tooltip
              formatter={(value: number, key: string) => [`${Math.round(value).toLocaleString("fr-FR")} mm`, names[key] ?? key]}
            />
            <Line dataKey="rainReal" stroke={RAIN} strokeWidth={2} dot={false} isAnimationActive={false} connectNulls={false} />
            <Line dataKey="rainProj" stroke={RAIN} strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} connectNulls={false} />
            <Line dataKey="et0Real" stroke={DEMAND} strokeWidth={2} dot={false} isAnimationActive={false} connectNulls={false} />
            <Line dataKey="et0Proj" stroke={DEMAND} strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}