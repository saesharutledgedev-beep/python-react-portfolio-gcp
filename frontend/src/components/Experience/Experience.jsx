import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExperienceInfo } from '../../features/experienceInfo/experienceInfoSlice'
import '../../App.css'

function Experience() {
  const dispatch = useDispatch()

  const experienceInfo = useSelector((state) => state.experienceInfo.items)
  const experienceInfoStatus = useSelector((state) => state.experienceInfo.status)
  const experienceInfoError = useSelector((state) => state.experienceInfo.error)
  const experienceInfoLoading = experienceInfoStatus === 'idle' || experienceInfoStatus === 'loading'

  useEffect(() => {
    dispatch(fetchExperienceInfo())
  }, [dispatch])

  return (
    <>
      <section id="experience">
        {experienceInfoLoading && <p>Loading experience info…</p>}
        {experienceInfoError && (
          <p className="error">Couldn't load experience info: {experienceInfoError}</p>
        )}
        {!experienceInfoLoading && !experienceInfoError && (
          <>
            <h2>{experienceInfo.name}</h2>
            <ul className="contact-list">
              {experienceInfo.experience_items.map((job) => (
                <li key={job.label}>
                  <h3>{job.title} — {job.label}</h3>
                  <p className="dates">{job.dates}</p>
                  <ul>
                    {job.details.split('\n').map((line, index) => (
                      <li key={index}>{line.trim()}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      <div className="ticks"></div>
    </>
  )
}

export default Experience
