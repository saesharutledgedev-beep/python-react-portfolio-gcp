import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHeroInfo } from '../../features/hero/heroSlice'
import '../../App.css'

function Hero() {
  const dispatch = useDispatch()
  const hero = useSelector((state) => state.hero.items)
  const heroStatus = useSelector((state) => state.hero.status)
  const heroError = useSelector((state) => state.hero.error)
  const heroLoading = heroStatus === 'idle' || heroStatus === 'loading'

  useEffect(() => {
    dispatch(fetchHeroInfo())
  }, [dispatch])

  return (
    <>

      <section id="hero">
        {/* <ul className="hero-list"> */}

          {heroLoading && <p>Loading hero…</p>}
          {heroError && (
            <p className="error">Couldn't load hero: {heroError}</p>
          )}
          {!heroLoading && !heroError && (
            <ul id="hero-list">
              {hero.heroDetails.split('\n\n').map((paragraph, index) => (
                <li className="hero-items" key={index}>{paragraph.trim()}</li>
              ))}
            </ul>
          )}

        {/* </ul> */}
      </section>
    </>
  )
}

export default Hero