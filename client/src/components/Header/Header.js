import React, { useRef, useEffect, useState, useCallback } from "react"
import "./Header.css"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../slices/auth"
import EventBus from "../../common/EventBus"
import LogoDark from "../../assets/img/BLACK SW.png"
import LogoLight from "../../assets/img/LIGHT SW.png"
import { Link } from "react-router-dom"

const Header = ({ theme, toggleTheme }) => {
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const [showModeratorBoard, setShowModeratorBoard] = useState(false)
  const [showAdminBoard, setShowAdminBoard] = useState(false)

  const { user: currentUser } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const logOut = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const headerFunc = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      headerRef.current.classList.add("header__shrink")
    } else {
      headerRef.current.classList.remove("header__shrink")
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", headerFunc)

    if (currentUser) {
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"))
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"))
    } else {
      setShowModeratorBoard(false)
      setShowAdminBoard(false)
    }

    EventBus.on("logout", () => {
      logOut()
    })

    return () => {
      window.removeEventListener("scroll", headerFunc)
      EventBus.remove("logout")
    }
  }, [currentUser, logOut])

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active")

  return (
    <header className="header" ref={headerRef}>
      <div className="container">
        <div className="nav__wrapper">
          <div className="logo">
          <img src={theme === 'light-theme' ? LogoLight : LogoDark} alt="logo-img" />
          </div>
          {/* Navigation */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu">
              <li className="menu__item">
                <Link to={'/home'} className="menu__link">
                  Home
                </Link>
              </li>
              <li className="menu__item">
              <Link to={'/main'} className="menu__link">
                  Forum
                </Link>
              </li>
              {showModeratorBoard && (
                <li className="menu__item">
                  <Link to={'/mod'} className="menu__link">
                    Board Moderator
                </Link>
                </li>
              )}
              {showModeratorBoard && (
                <li className="menu__item">
                  <Link to={'/log'} className="menu__link">
                    App Log
                </Link>
                </li>
              )}
              {currentUser ? (
                <>
                  <li className="menu__item">
                  <Link to={'/profile'} className="menu__link">
                  Profile
                </Link>
                  </li>
                  <li className="menu__item">
                    <Link className="menu__link" onClick={logOut}>
                      LogOut
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="menu__item">
                  <Link to={'/login'} className="menu__link">
                  Login
                </Link>
                  </li>
                  <li className="menu__item">
                  <Link to={'/register'} className="menu__link">
                  Register
                </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Model Light */}
          <div className="light__mode">
            <span onClick={toggleTheme}>
              {theme === "light-theme" ? (
                <span>
                  <i className="ri-moon-line"></i>Dark
                </span>
              ) : (
                <span>
                  <i className="ri-sun-line"></i> Light{" "}
                </span>
              )}
            </span>
          </div>

          <span className="mobile__menu" onClick={toggleMenu}>
            <i className="ri-menu-line"></i>
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
