export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}
