import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAboutInfo } from '../../features/about/aboutSlice'
import { fetchContactsInfo } from '../../features/contacts/contactsSlice'
import '../../App.css'
import headshotImg from '../../assets/Senger_Headshot.jpg'

function About() {
  const dispatch = useDispatch()
  const about = useSelector((state) => state.about.items)
  const aboutStatus = useSelector((state) => state.about.status)
  const aboutError = useSelector((state) => state.about.error)
  const aboutLoading = aboutStatus === 'idle' || aboutStatus === 'loading'

  const contacts = useSelector((state) => state.contacts.items)
  const contactsStatus = useSelector((state) => state.contacts.status)
  const contactsLoading = contactsStatus === 'idle' || contactsStatus === 'loading'

  useEffect(() => {
    dispatch(fetchAboutInfo())
    dispatch(fetchContactsInfo())
  }, [dispatch])

  return (
    <>
      <section id="about">
        <img
          src={headshotImg}
          className="headshot"
          width="160"
          height="160"
          alt="Saesha Rutledge, PhD"
        />
        <h1>Saesha Rutledge, PhD</h1>
        <p className="tagline">
          {aboutLoading && <p>Loading titles…</p>}
          {aboutError && (
            <p className="error">Couldn't load titles: {aboutError}</p>
          )}
          {!aboutLoading && !aboutError && (
         <ul className="contact-list">
              {about.titles.map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
          )}
          
        </p>
        {!contactsLoading && contacts.contact_links && (
          <ul className="contact-list quick-links">
            {contacts.contact_links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default About
