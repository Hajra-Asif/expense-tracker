// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiDollarSign, 
  FiCreditCard, 
  FiHelpCircle, 
  FiUser,
  FiMenu,
  FiX
} from "react-icons/fi";
import logo from "../assets/logo.svg"

function Sidebar() {
  const [mobileView, setMobileView] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowMenu(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", icon: <FiHome />, text: "Dashboard" },
    { path: "/income", icon: <FiDollarSign />, text: "Income Details" },
    { path: "/expenses", icon: <FiCreditCard />, text: "Expense History" },
    { path: "/support", icon: <FiHelpCircle />, text: "Support" },
    { path: "/profile", icon: <FiUser />, text: "Profile" }
  ];

  const renderNavItems = () => {
    return menuItems.map((item, index) => (
      <li key={index}>
        <Link 
          to={item.path} 
          className={`nav-link d-flex align-items-center ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => mobileView && setShowMenu(false)}
        >
          <span className="icon-container">{item.icon}</span>
          {item.text}
        </Link>
      </li>
    ));
  };

  return (
    <>
      {mobileView && (
        <div className="mobile-header">
          <div className="logo-container">
         <img className=" mx-2" width={"30px"} src={logo} alt="" />
            <span>Expense Tracker</span>
          </div>
          <button className="toggle-btn" onClick={toggleMenu}>
            {showMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      )}

      <div className={`sidebar ${mobileView ? 'mobile' : ''} ${showMenu ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h4>
            <img className="w-25 mx-2" src={logo} alt="" />
            Expense Tracker
          </h4>
        </div>
        
        <ul className="nav-menu">
          {renderNavItems()}
        </ul>
      </div>

      <style jsx="true">{`
        /* Sidebar Styles */
        .sidebar {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          padding: 1.5rem;
          width: 280px;
          background: #0a1e14;
          min-height: 100vh;
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1000;
        }

        .sidebar-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid #1f3a2a;
          padding-bottom: 1.25rem;
        }

        .sidebar-header h4 {
          color: #f0f0f0;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          margin-bottom: 0;
        }

        .logo-icon {
          color: #2ecc71;
          margin-right: 10px;
          font-size: 1.8rem;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          padding-left: 0;
          margin-bottom: auto;
          list-style: none;
          gap: 0.5rem;
        }

        .nav-link {
          color: #e0e0e0;
          font-family: 'Inter', sans-serif;
          border-radius: 8px;
          padding: 12px 15px;
          margin-bottom: 5px;
          background: transparent;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .nav-link:hover {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
        }

        .nav-link.active {
          background: #2ecc71;
          color: #0a1e14;
          font-weight: 500;
        }

        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 1.2rem;
        }

        /* Mobile Styles */
        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #0a1e14;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1001;
        }

        .logo-container {
          display: flex;
          align-items: center;
          color: #f0f0f0;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .toggle-btn {
          background: transparent;
          border: none;
          color: #2ecc71;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
        }

        .sidebar.mobile {
          position: fixed;
          top: 60px;
          left: -280px;
          height: calc(100vh - 60px);
          padding-top: 1rem;
        }

        .sidebar.mobile.show {
          left: 0;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 280px;
          }
        }
      `}</style>
    </>
  );
}

export default Sidebar;