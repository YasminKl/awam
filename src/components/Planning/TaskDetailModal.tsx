import Modal from "../Common/Modal";
import { STATUS_LABELS, type Activity } from "../../types/activity";
import { shortDay, taskDay } from "./planningUtils";

interface TaskDetailModalProps {
  task: Activity | null;
  /** Tâches attachées, si c'est une tâche principale */
  attached: Activity[];
  onClose: () => void;
  label: (a: Activity) => string;
  cropLabel: (id?: number | null) => string | null;
  teamName: (code: string) => string;
  overdue: boolean;
  onComplete: (a: Activity) => void;
  onCloseFollowUp: (a: Activity) => void;
  onEdit: (a: Activity) => void;
  onDelete: (a: Activity) => void;
  onOpen: (a: Activity) => void;
}

const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 12, padding: "5px 0", borderBottom: "1px solid #374151" };
const dim: React.CSSProperties = { color: "#9ca3af" };
const actionButton: React.CSSProperties = {
  flex: 1, borderRadius: 6, padding: "7px 0", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

/** Détail d'une tâche du calendrier, avec ses actions. */
export default function TaskDetailModal({
  task, attached, onClose, label, cropLabel, teamName, overdue,
  onComplete, onCloseFollowUp, onEdit, onDelete, onOpen,
}: TaskDetailModalProps) {
  if (!task) return null;
  const crop = cropLabel(task.crop_id);

  return (
    <Modal isOpen onClose={onClose} title={`${label(task)} · ${shortDay(taskDay(task))}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "system-ui, sans-serif", fontSize: 13, color: "#e5e7eb" }}>
        <div>
          <div style={row}>
            <span style={dim}>État</span>
            <span style={{ fontWeight: 600, color: overdue ? "#f87171" : undefined }}>
              {STATUS_LABELS[task.status]}
              {overdue && " · en retard"}
            </span>
          </div>
          {task.planned_for && (
            <div style={row}><span style={dim}>Date prévue</span><span>{shortDay(task.planned_for)}</span></div>
          )}
          {task.performed_at && (
            <div style={row}><span style={dim}>Date réelle</span><span>{shortDay(task.performed_at.slice(0, 10))}</span></div>
          )}
          <div style={row}><span style={dim}>Culture</span><span>{crop ?? "Toute la parcelle"}</span></div>
          <div style={row}><span style={dim}>Équipe</span><span>{task.team ? `Équipe ${teamName(task.team).toLowerCase()}` : "Aucune"}</span></div>
          <div style={{ ...row, borderBottom: "none" }}>
            <span style={dim}>Employés</span>
            <span style={{ textAlign: "right" }}>{task.employees.map((e) => e.full_name).join(", ") || "Aucun"}</span>
          </div>
        </div>

        {attached.length > 0 && (
          <div>
            <div style={{ ...dim, fontSize: 12, marginBottom: 4 }}>Tâches attachées</div>
            {attached.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onOpen(c)}
                style={{ display: "flex", width: "100%", justifyContent: "space-between", background: "#1f2937", border: "none", color: "#e5e7eb", borderRadius: 6, padding: "6px 8px", marginBottom: 4, cursor: "pointer", fontSize: 13 }}
              >
                <span>↳ {label(c)} · {shortDay(taskDay(c))}</span>
                <span style={dim}>{STATUS_LABELS[c.status]}</span>
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          {task.status === "a_realiser" && (
            <>
              <button type="button" onClick={() => onComplete(task)} style={{ ...actionButton, border: "none", background: "#16a34a", color: "#fff" }}>
                ✓ Marquer réalisée
              </button>
              <button type="button" onClick={() => onEdit(task)} style={{ ...actionButton, background: "transparent", border: "1px solid #4b5563", color: "#d1d5db" }}>
                ✎ Modifier
              </button>
            </>
          )}
          {task.status === "a_entretenir" && (
            <button type="button" onClick={() => onCloseFollowUp(task)} style={{ ...actionButton, border: "none", background: "#16a34a", color: "#fff" }}>
              ✓ Suivi terminé
            </button>
          )}
          <button type="button" onClick={() => onDelete(task)} style={{ ...actionButton, flex: "0 0 auto", padding: "7px 14px", background: "transparent", border: "1px solid #7f1d1d", color: "#fca5a5" }}>
            🗑 Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
}