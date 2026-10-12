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
        <h2 id="resume-name">Résumé</h2>
        <div className="modal-actions resume">
          <a href="/Saesha_Rutledge_Resume_THD_EngineeringManager09012026.pdf" download>
            Engineering Manager Résumé
          </a>
          <a href="/SaeshaRutledgeTechProdManager_09032026 (1).pdf" download>
            Product Manager Résumé
          </a>
        </div>
      </Modal>
      <Modal isOpen={activeModal === 'publications'} onClose={closeModal}>
        <h2 id="publications-name">Publications</h2>
        <div className="modal-actions publications">
          <a href="https://journal.media-culture.org.au/index.php/mcjournal/search/authors/view?givenName=Saesha&familyName=Senger&affiliation=University%20of%20Kentucky&country=US&authorName=Senger%2C%20Saesha" target="_blank">
            Place, Space, and Time in MC Solaar’s American Francophone
          </a>
          <a href="https://journal.equinoxpub.com/JWPM/article/view/7763" target="_blank">
            MC Solaar and the Influence of Globalization on Local Hip-Hop Aesthetics
          </a>
          <a href="https://uknowledge.uky.edu/music_etds/150/" target="_blank">
            Gender, Politics, Market Segmentation, and Taste: Adult Contemporary Radio at the End of the Twentieth Century
          </a>
          <a href="https://www.routledge.com/Mixing-Pop-and-Politics-Political-Dimensions-of-Popular-Music-in-the-21st-Century/Hoad-Stahl-Wilson/p/book/9780367248093" target="_blank">
            Mixing Pop and Politics
            Political Dimensions of Popular Music in the 21st Century
          </a>
        </div>
      </Modal>
    </>
  )
}

export default App
