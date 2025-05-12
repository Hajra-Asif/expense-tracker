import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import ExpenseChart from "../components/ExpenseChart";
import IncomeChart from "../components/IncomeChart";
import Sidebar from "../components/Sidebar";
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500&display=swap" rel="stylesheet"></link>
import CombinedChart from "../components/CombinedChart";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.fullName);
          } else {
            setUserName(user.email);
          }
        } catch (err) {
          console.error("Error fetching user fullName:", err);
          setUserName(user.email);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const expRef = query(collection(db, "expenses"), where("userId", "==", userId));
    const incRef = query(collection(db, "income"), where("userId", "==", userId));

    const unsubExp = onSnapshot(expRef, (snap) =>
      setExpenses(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    const unsubInc = onSnapshot(incRef, (snap) =>
      setIncome(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );

    return () => {
      unsubExp();
      unsubInc();
    };
  }, [userId]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  if (income.length === 0 && expenses.length === 0) {
    return (
      <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Sidebar />
        <div className="container-fluid p-5" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 style={{ 
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#2d3436'
            }}>Dashboard Overview</h3>
            <button 
              className="btn btn-outline-danger" 
              onClick={handleLogout}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                borderRadius: '8px',
                padding: '8px 16px'
              }}>
              Logout
            </button>
          </div>
          <div className="alert alert-warning" style={{
            borderRadius: '12px',
            borderLeft: '4px solid #f39c12',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <strong>No data available</strong> - Start adding your income and expenses to visualize your financial patterns.
          </div>
        </div>
      </div>
    );
  }

  const combinedData = [
    ...income.map(item => ({ ...item, type: "Income", date: item.date, amount: item.amount })),
    ...expenses.map(item => ({ ...item, type: "Expense", date: item.date, amount: item.amount }))
  ];

  const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);
  const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
  const net = totalIncome - totalExpenses;
  const status = net >= 0 ? "Gain" : "Loss";

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      <div className="container-fluid p-5" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 style={{ 
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: '#2d3436'
          }}>Dashboard Overview</h3>
          <button 
            className="btn btn-outline-danger" 
            onClick={handleLogout}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px'
            }}>
            Logout
          </button>
        </div>

        {/* Welcome Message */}
        <div className="alert alert-success mt-3 mb-4" style={{
          borderRadius: '12px',
          borderLeft: '4px solid #00b894',
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          backgroundColor: '#f8fff8'
        }}>
          👋 Welcome, <strong>{userName}</strong>! Hope you're having a financially amazing day! 💚
        </div>

        {/* Financial Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#636e72' }}>Total Income</h5>
                <h2 className="text-success">${totalIncome.toFixed(2)}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#636e72' }}>Total Expenses</h5>
                <h2 className="text-danger">${totalExpenses.toFixed(2)}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: status === 'Gain' ? 'rgba(0, 184, 148, 0.1)' : 'rgba(214, 48, 49, 0.1)'
            }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#636e72' }}>Net {status}</h5>
                <h2 className={status === 'Gain' ? 'text-success' : 'text-danger'}>
                  {status === 'Gain' ? `+$${net.toFixed(2)}` : `-$${Math.abs(net.toFixed(2))}`}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Chart */}
        <div className="card mb-4" style={{
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div className="card-body">
            <h5 className="card-title mb-4" style={{ color: '#2d3436' }}>Income vs Expenses</h5>
            <CombinedChart data={combinedData} />
          </div>
        </div>

        {/* Charts Row */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: '#2d3436' }}>Income Breakdown</h5>
                <IncomeChart data={income} />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: '#2d3436' }}>Expense Breakdown</h5>
                <ExpenseChart expenses={expenses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;