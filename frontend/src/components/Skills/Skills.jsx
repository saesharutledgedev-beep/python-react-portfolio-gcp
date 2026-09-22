import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSkills } from '../../features/skills/skillsSlice'
import '../../App.css'

function Skills() {
  const dispatch = useDispatch()
  const skills = useSelector((state) => state.skills.items)
  const skillsStatus = useSelector((state) => state.skills.status)
  const skillsError = useSelector((state) => state.skills.error)
  const skillsLoading = skillsStatus === 'idle' || skillsStatus === 'loading'

  useEffect(() => {
    dispatch(fetchSkills())
  }, [dispatch])

  return (
    <>
      <section id="technical-skills">
        {skillsLoading && <p>Loading technical skills…</p>}
        {skillsError && (
          <p className="error">Couldn't load technical skills: {skillsError}</p>
        )}
        {!skillsLoading && !skillsError && (
          <>
            <h2>{skills.skills_info[0].label}</h2>
            <p>
              <span className="contact-list">
                {skills.skills_info[0].details}
              </span>
            </p>
          </>
        )}
      </section>

      <div className="ticks"></div>

      <section id="professional-skills">
        {skillsLoading && <p>Loading professional skills…</p>}
        {skillsError && (
          <p className="error">Couldn't load professional skills: {skillsError}</p>
        )}
        {!skillsLoading && !skillsError && (
          <>
            <h2>{skills.skills_info[1].label}</h2>
            <p>
              <span className="contact-list">
                {skills.skills_info[1].details}
              </span>
            </p>
          </>
        )}
      </section>

      <div className="ticks"></div>

      <section id="tooling">
        {skillsLoading && <p>Loading tooling…</p>}
        {skillsError && (
          <p className="error">Couldn't load tooling: {skillsError}</p>
        )}
        {!skillsLoading && !skillsError && (
          <>
            <h2>{skills.skills_info[2].label}</h2>
            <p>
              <span className="contact-list">
                {skills.skills_info[2].details}
              </span>
            </p>
          </>
        )}
      </section>
      <div className="ticks"></div>
    </>
  )
}

export default Skills
