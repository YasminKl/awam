/** Styles communs des fenêtres claires (Dialog) : boutons, libellés, champs */

export const dialogButton = {
  secondary: {
    padding: "8px 16px", fontSize: 13, borderRadius: 8, border: "1px solid #d1d5db",
    background: "#fff", color: "#374151", cursor: "pointer",
  } as React.CSSProperties,
  primary: {
    padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none",
    background: "#1b4332", color: "#fff", cursor: "pointer",
  } as React.CSSProperties,
};

/** Libellé au-dessus d'un champ */
export const dialogLabel: React.CSSProperties = { fontSize: 12, color: "#4b5563", minWidth: 0, display: "block" };

/** Champ simple : texte, liste */
export const dialogInput: React.CSSProperties = {
  width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8,
  background: "#fff", color: "#111827", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box",
};

/** Titre de section, avec son icône : vert pour le sol, bleu pour l'eau… */
export const dialogSection = (color: string): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color, margin: "4px 0 0",
});