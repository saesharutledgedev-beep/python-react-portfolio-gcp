import '../../App.css'

const modalSections = [
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Résumé' },
]

function Nav({ onOpenModal }) {
  return (
    <nav className="site-nav">
      {modalSections.map((section) => (
        <button key={section.id} type="button" onClick={() => onOpenModal(section.id)}>
          {section.label}
        </button>
      ))}
    </nav>
  )
}

export default Nav
