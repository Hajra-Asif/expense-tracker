// src/components/Sidebar.js
import { Link } from "react-router-dom";
import { 
  FiHome, 
  FiDollarSign, 
  FiCreditCard, 
  FiHelpCircle, 
  FiUser 
} from "react-icons/fi";

function Sidebar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-4" 
         style={{ 
           width: "280px",
           background: "#0a0a0a",
           minHeight: "100vh",
           boxShadow: "4px 0 15px rgba(0, 0, 0, 0.3)"
         }}>
      <div className="mb-5" style={{ borderBottom: "1px solid #333", paddingBottom: "20px" }}>
        <h4 className="mb-0" style={{
          color: "#f0f0f0",
          fontFamily: "'Poppins', `sans-serif",
          fontWeight: "600",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center"
        }}>
          <FiDollarSign style={{ 
            color: "#6c5ce7", 
            marginRight: "10px", 
            fontSize: "1.8rem" 
          }} />
          Expense Tracker
        </h4>
      </div>
      
      <ul className="nav nav-pills flex-column mb-auto gap-2">
        <li>
          <Link to="/" className="nav-link d-flex align-items-center" 
                style={{
                  color: "#e0e0e0",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "8px",
                  padding: "12px 15px",
                  marginBottom: "5px",
                  background: "transparent",
                  transition: "all 0.3s ease"
                }}
                activeStyle={{
                  background: "#6c5ce7",
                  color: "#fff"
                }}>
            <FiHome style={{ marginRight: "12px", fontSize: "1.2rem" }} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/income" className="nav-link d-flex align-items-center"
                style={{
                  color: "#e0e0e0",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "8px",
                  padding: "12px 15px",
                  marginBottom: "5px",
                  background: "transparent",
                  transition: "all 0.3s ease"
                }}
                activeStyle={{
                  background: "#6c5ce7",
                  color: "#fff"
                }}>
            <FiDollarSign style={{ marginRight: "12px", fontSize: "1.2rem" }} />
            Income Details
          </Link>
        </li>
        <li>
          <Link to="/expenses" className="nav-link d-flex align-items-center"
                style={{
                  color: "#e0e0e0",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "8px",
                  padding: "12px 15px",
                  marginBottom: "5px",
                  background: "transparent",
                  transition: "all 0.3s ease"
                }}
                activeStyle={{
                  background: "#6c5ce7",
                  color: "#fff"
                }}>
            <FiCreditCard style={{ marginRight: "12px", fontSize: "1.2rem" }} />
            Expense History
          </Link>
        </li>
        <li>
          <Link to="/support" className="nav-link d-flex align-items-center"
                style={{
                  color: "#e0e0e0",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "8px",
                  padding: "12px 15px",
                  marginBottom: "5px",
                  background: "transparent",
                  transition: "all 0.3s ease"
                }}
                activeStyle={{
                  background: "#6c5ce7",
                  color: "#fff"
                }}>
            <FiHelpCircle style={{ marginRight: "12px", fontSize: "1.2rem" }} />
            Support
          </Link>
        </li>
        <li>
          <Link to="/profile" className="nav-link d-flex align-items-center"
                style={{
                  color: "#e0e0e0",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "8px",
                  padding: "12px 15px",
                  marginBottom: "5px",
                  background: "transparent",
                  transition: "all 0.3s ease"
                }}
                activeStyle={{
                  background: "#6c5ce7",
                  color: "#fff"
                }}>
            <FiUser style={{ marginRight: "12px", fontSize: "1.2rem" }} />
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;