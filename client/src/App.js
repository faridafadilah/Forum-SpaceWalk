import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route,  Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import BoardModerator from "./components/Moderator/BoardModerator";
import EditUser from './components/Moderator/EditUser'
import Header from './components/Header/Header'
import CreateMainForum from './pages/MainForum/CreateMainForum'
import ShowMainForum from './pages/MainForum/ShowMainForum'
import EditMainForum from './pages/MainForum/EditMainForum'
import DetailMainForum from './pages/MainForum/DetailMainForum'
import CreateSubForum from './pages/SubForum/CreateSubForum'
import ShowSubForum from './pages/SubForum/ShowSubForum'
import EditSubForum from './pages/SubForum/EditSubForum'
import CreateThread from './pages/Thread/CreateThread'
import ShowThread from './pages/Thread/ShowThread'
import EditProfile from './components/Profile/EditProfile'
import ProfileUser from './components/Profile/ProfileUser'
import BoardLogger from './components/Moderator/BoardLogger'

import { logout } from "./slices/auth";
import EventBus from './common/EventBus'


const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
    }

    EventBus.on('logout', () => {
      logOut()
    })

    return () => {
      EventBus.remove('logout')
    }
  }, [currentUser, logOut])

  // Dark Mode
  const [theme, setTheme] = useLocalStorageState('theme', 'light-theme')

  function useLocalStorageState(key, initialValue) {
    const [value, setValue] = useState(() => {
      const persistedValue = localStorage.getItem(key)
      return persistedValue !== null ? persistedValue : initialValue
    })

    useEffect(() => {
      localStorage.setItem(key, value)
    }, [key, value])

    return [value, setValue]
  }

  const toggleTheme = () => {
    theme === 'light-theme' ? setTheme('') : setTheme('light-theme')
  }

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <Router>
      <div>
        <Header theme={theme} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/home" element={<Home theme={theme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<ProfileUser />} />
            <Route
              path="/edit-profile"
              element={currentUser ? <EditProfile theme={theme} /> : <Navigate to="/login" />}
            />
            <Route path="/mod" element={<BoardModerator />} />
            <Route
            path="/mod/:id"
            element={showModeratorBoard ? <EditUser theme={theme} /> : <Home theme={theme} />}
          />
          <Route path="/log" element={showModeratorBoard ? <BoardLogger theme={theme} /> : <Home theme={theme} />} />
            <Route
            path="/main/create"
            element={
              showModeratorBoard || showAdminBoard ? <CreateMainForum /> : <Navigate to="/login" />
            }
          />
          <Route path="/main/edit/:id" element={showModeratorBoard || showAdminBoard ? <EditMainForum  /> : <Navigate to="/login" />} />
          <Route path="/main/:id" element={<DetailMainForum />} />
          <Route path="/main" element={<ShowMainForum />} />
          <Route
            path="/sub/create/:mainforumId"
            element={
              showModeratorBoard || showAdminBoard ? <CreateSubForum theme={theme} /> : <Navigate to="/login" />
            }
          />
          <Route path="/sub/edit/:id" element={<EditSubForum theme={theme} />} />
          <Route path="/sub/:id" element={<ShowSubForum theme={theme} />} />
          <Route
            path="/thread/create/:subforumId"
            element={currentUser ? <CreateThread theme={theme} /> : <Navigate to="/login" />}
          />
          <Route path="/thread/:id" element={<ShowThread theme={theme} />} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;