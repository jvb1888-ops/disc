import styles from './ConfirmModal.module.css'

interface Props {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ title, message, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        style={{ maxWidth: 440 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className={styles.icon}>🗑️</div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1 }}>
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  )
}
