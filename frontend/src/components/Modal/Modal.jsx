import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    // 1. Define the Escape key handler
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    // 2. Bind the event only if the modal is currently open
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    // 3. Clean up the listener when the modal closes or unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose]) // Dependencies ensure the listener updates correctly

  // Early return if the modal shouldn't render
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
};
