import { useState, ReactNode } from "react";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Header onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />

      {/* Contenu : Sidebar + Zone principale */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar collapsed={sidebarCollapsed} />

        <main style={{ flex: 1, overflow: "auto", background: "#f9fafb" }}>
          {children}
        </main>
      </div>
    </div>
  );
}