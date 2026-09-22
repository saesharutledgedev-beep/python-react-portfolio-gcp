import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects } from '../../features/projects/projectsSlice'
import '../../App.css'

function Projects() {
  const dispatch = useDispatch()
  const projects = useSelector((state) => state.projects.items)
  const projectsStatus = useSelector((state) => state.projects.status)
  const projectsError = useSelector((state) => state.projects.error)
  const projectsLoading = projectsStatus === 'idle' || projectsStatus === 'loading'

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  return (
    <>
      <section id="projects">
        {projectsLoading && <p>Loading projects…</p>}
        {projectsError && (
          <p className="error">Couldn't load projects: {projectsError}</p>
        )}
        {!projectsLoading && !projectsError && (
          <>
            <h2>{projects.name}</h2>
            <ul className="project-list">
              {projects.project_items.map((project) => (
                <li key={project.id} className="project-card">
                  <h3>{project.project_name}</h3>
                  <p>{project.description}</p>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noreferrer">
                      View on GitHub
                    </a>
                  )}
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

export default Projects
