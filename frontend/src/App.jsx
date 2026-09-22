import { useState } from 'react'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Summary from './components/Summary/Summary'
import Skills from './components/Skills/Skills'
import Education from './components/Education/Education'
import Experience from './components/Experience/Experience'
import Projects from './components/Projects/Projects'
import Modal from './components/Modal/Modal'

function App() {
  const [activeModal, setActiveModal] = useState(null) // null | 'experience' | 'skills' | 'education' | 'projects' | 'resume'
  const closeModal = () => setActiveModal(null)

  return (
    <>
      <Nav onOpenModal={setActiveModal} />

      <div id="top-content">
        <About />
        <Hero />
      </div>

      <Summary />

      <Modal isOpen={activeModal === 'experience'} onClose={closeModal}>
        <Experience />
      </Modal>
      <Modal isOpen={activeModal === 'skills'} onClose={closeModal}>
        <Skills />
      </Modal>
      <Modal isOpen={activeModal === 'education'} onClose={closeModal}>
        <Education />
      </Modal>
      <Modal isOpen={activeModal === 'projects'} onClose={closeModal}>
        <Projects />
      </Modal>
      <Modal isOpen={activeModal === 'resume'} onClose={closeModal}>
        <h2>Résumé</h2>
        <div className="modal-actions">
          <a href="/Saesha_Rutledge_Resume_THD_EngineeringManager09012026.pdf" download>
            Engineering Manager Résumé
          </a>
          <a href="/SaeshaRutledgeTechProdManager_09032026 (1).pdf" download>
            Product Manager Résumé
          </a>
        </div>
      </Modal>
    </>
  )
}

export default App
