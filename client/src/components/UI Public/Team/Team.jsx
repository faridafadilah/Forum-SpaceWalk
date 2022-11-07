import React, {useState} from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Team.css"

const API_MAIN = 'http://localhost:8080/api/main'

const Team = () => {
  const navigate = useNavigate()
  const [mains, setMains] = useState([])
  const [limit, setLimit] = useState(4)

  useEffect(() => {
    getMains()
  }, [])

  const getMains = async () => {
    const response = await axios.get(API_MAIN + `?limit=${limit}`)
    const newMains = response.data.result
    setMains([...mains, ...newMains])
  }


  return (
    <section className="our__team">
      <div className="container">
        <div className="team__content">
          <h6 className="subtitle">New Category Just For You!</h6>
          <h2>
          Which team <span className="highlight">are you?</span>
          </h2>
        </div>

        <div className="team__wrapper">
          {mains.map((main, index) => (
            <div className="team__item" key={index} onClick={() => navigate(`/main/${main.id}`)}>
              <div className="team__img">
                <img src={main.url} alt="" />
              </div>
              <div className="team__details">
                <h4>{main.title}</h4>
                <p className="description">{main.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Team
