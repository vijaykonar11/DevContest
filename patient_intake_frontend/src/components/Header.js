import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoginModal from "../Pages/Auth/Login";
import SignupModal from "../Pages/Auth/Signup";

import logo from "../assets/logo.png";
import "../App.css";
import { clearUser } from "../features/user/UserSlice";
import { FaUserCircle } from "react-icons/fa";
import { closeModal, setModal } from "../features/modal/ModalSlice";

import { GiHamburgerMenu } from "react-icons/gi";
import { FaPlus, FaMinus } from "react-icons/fa6";

const Header = () => {
  const [user, setUser] = useState(null);

  const [activeLink, setActiveLink] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userGlobal = useSelector((state) => state?.userInfo?.user);
  // console.log(userGlobal);
  const modal = useSelector((state) => state?.modal?.modal);

  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/how-healthWeb-works":
        setActiveLink("How it works");
        break;
      case "/pricing":
        setActiveLink("Pricing");
        break;
      case "/audio":
        setActiveLink("Audio Converter");
        break;
      case "/about":
      case "/contact":
      case "/partner":
      case "/careers":
        setActiveLink("About");
        break;
      default:
        setActiveLink("");
        break;
    }
  }, [location]);

  // const storedData = localStorage.getItem("userData");

  useEffect(() => {
    if (("user: ", userGlobal)) {
      // console.log(userGlobal);
      try {
        setUser(userGlobal);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, [userGlobal]);

  const handleScrollToFAQs = () => {
    const faqSection = document.getElementById("faq-container");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
    navigate("/#faqs");
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    dispatch(setModal({ type: "login" }));
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    dispatch(closeModal());
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
    dispatch(setModal({ type: "signup" }));
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
    dispatch(closeModal());
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("userData");
    setUser(null);
    dispatch(clearUser());
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify({ data: userData }));
    closeLoginModal();
  };

  const [showMenu, setShowMenu] = useState();

  const toggleButton = () => {
    setShowMenu(!showMenu);
  };

  const [subMenu, setSubMenu] = useState();
  // const subMenuToggle = () => {
  //   setSubMenu(!subMenu)
  // };
  const subMenuToggle = (index) => {
    setSubMenu((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <header
      className={`${
        showMenu ? "active" : " "
      } topHeader d-flex justify-content-between align-items-center py-2 px-2 px-lg-4`}
    >
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>

      <div className="position-relative">
        <button className="respMenuBtn" onClick={toggleButton}>
          <GiHamburgerMenu />
        </button>
        <ul className="menuList">
          {/* <li><a href="#faqs" onClick={handleScrollToFAQs}>FAQs</a></li> */}

          <li className={user ? "dropArrow" : ""}>
            <NavLink to="/transcript">AI Scribe</NavLink>
            {user && (
              <>
                <span onClick={() => subMenuToggle(0)}>
                  {subMenu === 0 ? <FaMinus /> : <FaPlus />}
                </span>
                <ul className={`${subMenu === 0 ? "active" : ""} subMenu dropdown-menu`}>
                  <li>
                    <Link to="/audio">Conversation History</Link>
                  </li>
                </ul>
              </>
            )}
          </li>

          <li className={user ? "dropArrow" : ""}>
            <NavLink to="/patient-intake">Patient Intake</NavLink>
            {user && (
              <>
                <span onClick={() => subMenuToggle(1)}>
                  {subMenu === 1 ? <FaMinus /> : <FaPlus />}
                </span>
                <ul className={`${subMenu === 1 ? "active" : ""} subMenu dropdown-menu`}>
                  <li>
                    <Link to="/patient-intake-history">Patient History</Link>
                  </li>
                </ul>
              </>
            )}
          </li>

          {/* <li><a href="#">Patient Intake</a></li> */}

          {/* {user && (
            <li>
            <NavLink to="/audio">Audio Converter</NavLink>
            </li>
            )}
            <li><NavLink to="/transcript">Transcript</NavLink></li> */}

          <li>
            <NavLink to="/SMS-Service">SMS Service</NavLink>
          </li>
          <li>
            <NavLink to="/how-healthWeb-works">How it works</NavLink>
          </li>

          <li className="dropArrow">
            <NavLink to="/about">About Us</NavLink>
            <span onClick={() => subMenuToggle(2)}>{subMenu === 2 ? <FaMinus /> : <FaPlus />}</span>
            <ul className={`${subMenu === 2 ? "active" : ""} subMenu dropdown-menu`}>
              <li>
                <Link href="#faqs" onClick={handleScrollToFAQs}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/live-conversation">Live conversation</Link>
              </li>
              <li>
                <Link to="/demo-video">Demo Video</Link>
              </li>
              <li>
                <Link to="/about/partner-with-healthWeb">Partner with Health Web</Link>
              </li>
              <li>
                <Link to="/about/careers">Careers</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/privacy-policy">
                  Privacy Policies
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/terms-conditions">
                  Terrms and Conditions
                </Link>
              </li>
            </ul>
          </li>

          {user ? (
            <li className="dropArrow">
              <Link className="user-icon"><FaUserCircle /></Link>  
              <span onClick={() => subMenuToggle(3)}>{subMenu === 3 ? <FaMinus /> : <FaPlus />}</span>
            <ul className={`${subMenu === 3 ? "active" : ""} subMenu dropdown-menu`}>
              <li><Link to="#">{user.first_name}</Link></li>
              <li><Link to="/error-logs">Error Logs</Link></li>
              <li><Link to="/change-password">Update Password</Link></li>
              <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
            </ul>
            </li>
          ) : (
            <>
              <li>
                <Link to="#" onClick={openLoginModal}>Login</Link>
              </li>
            </>
          )}

          <li>
            <button
              type="button"
              className="btn logoColorBtn"
              onClick={() => navigate("/about/partner-with-healthWeb")}
            >
              Talk to sales
            </button>
          </li>

          <li>
            <LoginModal
              open={modal.type === "login"}
              onClose={closeLoginModal}
              onRegisterOpen={openSignupModal}
              onLoginSuccess={handleLoginSuccess}
              onLoginOpen={openLoginModal}
            />
            <SignupModal
              open={modal.type === "signup"}
              onClose={closeSignupModal}
              onLoginOpen={openLoginModal}
            />
            {/* <ForgotPasswordModal
            open={forgotPasswordOpen}
            onClose={handleForgotPasswordClose}
            onRegisterOpen={onRegisterOpen}
            onLoginOpen={onLoginOpen}
          /> */}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
