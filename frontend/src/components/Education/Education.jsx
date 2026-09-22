import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEducationInfo } from '../../features/educationInfo/educationInfoSlice'
import '../../App.css'

function Education() {
  const dispatch = useDispatch()
  const educationInfo = useSelector((state) => state.educationInfo.items)
  const educationInfoStatus = useSelector((state) => state.educationInfo.status)
  const educationInfoError = useSelector((state) => state.educationInfo.error)
  const educationInfoLoading = educationInfoStatus === 'idle' || educationInfoStatus === 'loading'

  useEffect(() => {
    dispatch(fetchEducationInfo())
  }, [dispatch])

  return (
    <>
      <section id="education">
        {educationInfoLoading && <p>Loading education info…</p>}
        {educationInfoError && (
          <p className="error">Couldn't load education info: {educationInfoError}</p>
        )}
        {!educationInfoLoading && !educationInfoError && (
          <>
            <h2>{educationInfo.name}</h2>
            <ul className="contact-list">
              {educationInfo.education_info.map((school) => (
                <li key={school.label}>
                  <h3>{school.label}</h3>
                  <ul>
                    {school.details.split('\n').map((line, index) => (
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

export default Education
