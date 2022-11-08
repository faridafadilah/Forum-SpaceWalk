import React from 'react'
import './CatBest.css'
import { useNavigate } from 'react-router-dom'

const categoryData = [
  {
    link: '/main/4',
    icon: 'ri-apps-line',
    title: 'Games',
    desc: 'Advisor for the Collaboration of the Indonesian East Area Community (KITA) Gunawan Prasetyo said, the Euro Club is part of the KITA collaboration that continues to consistently develop the potential of gamers in community-based areas. This year, a national-scale tournament was held again, starting with qualifications at the district and city levels.'
  },
  {
    link: '/main/3',
    icon: 'ri-landscape-line',
    title: 'Web Design',
    desc: "God Level, This Person Paints with 'Pure HTML and CSS' Diana Adrianne Smith, is the person behind all of this, the programmer community on Twitter is amazed to see her work. How can it be as realistic as this, when everything is generated from the pure structure of HTML and CSS codes!",
  },
  {
    link: '/main/2',
    icon: 'ri-code-s-slash-line',
    title: 'Web Developer',
    desc: 'If you have a sufficient app development budget, the right team of highly skilled developers, and picked the right app development framework then no power on earth could stop your app from being successful.   '
  },
  {
    link: '/main/1',
    icon: 'ri-rocket-line',
    title: 'Healty',
    desc: "Hello, those of you who feel lazy to exercise because they have to leave the house for jogging or cycling for 60 minutes, Now there is a sport called High Intensity Interval Training, aka HIIT, which can burn calories for 20 minutes."
  },
]

const CatBest = () => {
  const navigate = useNavigate();
  return (
    <section id="category">
      <div className="container">
        <div className="categorys__top-content">
          <h6 className="subtitle">Our Category</h6>
          <h2>Best Category Special Only For You!</h2>
          <h2 className="highlight"> our best category</h2>
        </div>

        <div className="category__item-wrapper">
          {categoryData.map((item, index) => (
            <div className="categorys__item" key={index}  onClick={() => navigate(item.link)}>
              <span className="category__icon">
                <i className={item.icon}></i>
              </span>
              <h3 className="category__title">{item.title}</h3>
              <p className="description">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CatBest
