import React from 'react'
import './Footer.css'
import LogoDark from '../../../assets/img/BLACK SW.png'
import LogoLight from '../../../assets/img/LIGHT SW.png'

const Footer = ({ theme }) => {
  const year = new Date().getFullYear()
  return (
    <footer id="footer">
      <div className="container">
        <div className="footer__logo">
          <img src={theme === '' ? LogoDark : LogoLight} alt="logo-img" />
        </div>
        <p>
          Hello!! Here is a new way to add new insights only in SPACEWALK.
        </p>
        <div className="social-links">
          <a href="http://wa.me/+628815877610" className="whatsapp">
          <i className="ri-whatsapp-line"></i>
          </a>
          <a href="https://github.com/faridafadilah/" className="github">
          <i className="ri-github-line"></i>
          </a>
          <a href="https://www.instagram.com/rida_dilah?r=nametag" className="instagram">
          <i className="ri-instagram-line"></i>
          </a>
          <a href="https://www.linkedin.com/in/farida-fadilah-57552b20b" className="linkedin">
          <i className="ri-linkedin-line"></i>
          </a>
        </div>
        <div className="copyright">
          &copy; Copyright {year}{' '}
          <strong>
            <span>Farida Fadilah</span>
          </strong>
          . All Rights Reserved
        </div>
        <div className="credits">
          Designed by <a>Rida Official</a>
        </div>
      </div>
    </footer>
  )
}
export default Footer
