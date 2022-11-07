import { useState, useEffect } from "react"
// import { ArrowRightCircle } from "react-bootstrap-icons"
import TrackVisibility from "react-on-screen"
import headerImg from "../../../assets/img/header-img.svg"
import {Link} from "react-router-dom"
import "animate.css"
import "./LandingPage.css"

const LandingPage = ({ theme }) => {
  const [loopNum, setLoopNum] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [text, setText] = useState("")
  const [delta, setDelta] = useState(300 - Math.random() * 100)
  const [index, setIndex] = useState(1)
  const toRotate = ["Flexible", "Respect", "Comfortable"]
  const period = 2000

  useEffect(() => {
    let ticker = setInterval(() => {
      tick()
    }, delta)

    return () => {
      clearInterval(ticker)
    }
  }, [text])

  const tick = () => {
    let i = loopNum % toRotate.length
    let fullText = toRotate[i]
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1)

    setText(updatedText)

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2)
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true)
      setIndex((prevIndex) => prevIndex - 1)
      setDelta(period)
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false)
      setLoopNum(loopNum + 1)
      setIndex(1)
      setDelta(500)
    } else {
      setIndex((prevIndex) => prevIndex + 1)
    }
  }

  return (
    <div className="landing">
      <section className="landingPage__section" id="home">
        <div className="container">
          <div className="landingPage__wrapper">
            <div className="landingPage__content">
              <div>
                <h2 className="welcome">Welcome to Space Walk</h2>
                <h2 className="highlight">
                  {`Forum App`}{" "}
                  <span
                    className="txt-rotate"
                    period="1000"
                    data-rotate='[ "Flexsible", "Respect", "Comfortable" ]'
                  >
                    <span className="wrap">{text}</span>
                  </span>
                </h2>
              </div>
              <p className="description">
              "There are two possibilities, whether we are alone in space or not. Both are equally scary"
              </p>
              {/* <div className="landingPage__btns">
              <button className='primary__btn' onClick={() => console.log('connect')}>Get Started <ArrowRightCircle size={25} /></button>
            </div> */}
              <Link to={'/main'}>
                <button className="learn-more mt-4 ms-3 mb-3">
                  {" "}
                  <span className="circle" aria-hidden="true">
                    <span className="in arrow"></span>
                  </span>{" "}
                  <span className="button-text">Get Started</span>{" "}
                </button>{" "}
              </Link>
            </div>
            <div className="landingPage__img">
              <TrackVisibility>
                {({ isVisible }) => (
                  <div
                    className={
                      isVisible ? "animate__animated animate__zoomIn" : ""
                    }
                  >
                    <img src={headerImg} alt="landingPage-img" />
                  </div>
                )}
              </TrackVisibility>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
