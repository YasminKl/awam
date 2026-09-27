import DashboardLayout from "../components/Dashboard/DashboardLayout.tsx";

export default function ParcellesPage() {
  return (
    <DashboardLayout>
      <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1>Parcelles</h1>
        <p>Liste des parcelles à venir.</p>
      </div>
    </DashboardLayout>
  );
}