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
      <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#111', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <div className="container-fluid p-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 style={{ 
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#4CD964'
            }}>Dashboard Overview</h3>
            <button 
              className="btn btn-outline-danger" 
              onClick={handleLogout}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                borderRadius: '8px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #ff3b30',
                color: '#fff'
              }}>
              Logout
            </button>
          </div>
          <div className="alert" style={{
            borderRadius: '12px',
            borderLeft: '4px solid #4CD964',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: '#222',
            color: '#ccc',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            <strong style={{ color: '#fff' }}>No data available</strong> - Start adding your income and expenses to visualize your financial patterns.
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
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#111', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div className="container-fluid p-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 style={{ 
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: '#4CD964'
          }}>Dashboard Overview</h3>
          <button 
            className="btn" 
            onClick={handleLogout}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #ff3b30',
              color: '#fff'
            }}>
            Logout
          </button>
        </div>

        {/* Welcome Message */}
        <div className="alert mt-3 mb-4" style={{
          borderRadius: '12px',
          borderLeft: '4px solid #4CD964',
          fontFamily: "'Inter', sans-serif",
          backgroundColor: '#222',
          color: '#ccc',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          👋 Welcome, <strong style={{ color: '#fff' }}>{userName}</strong>! Hope you're having a financially amazing day! 💚
        </div>

        {/* Financial Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              backgroundColor: '#222',
              color: '#fff'
            }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#aaa' }}>Total Income</h5>
                <h2 style={{ color: '#4CD964' }}>${totalIncome.toFixed(2)}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              backgroundColor: '#222',
              color: '#fff'
            }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#aaa' }}>Total Expenses</h5>
                <h2 style={{ color: '#ff3b30' }}>${totalExpenses.toFixed(2)}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              backgroundColor: status === 'Gain' ? 'rgba(76, 217, 100, 0.2)' : 'rgba(255, 59, 48, 0.2)',
              color: '#fff'
            }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#aaa' }}>Net {status}</h5>
                <h2 style={{ color: status === 'Gain' ? '#4CD964' : '#ff3b30' }}>
                  {status === 'Gain' ? `+$${net.toFixed(2)}` : `-$${Math.abs(net).toFixed(2)}`}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Chart */}
        <div className="card mb-4" style={{
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          backgroundColor: '#222',
          color: '#fff'
        }}>
          <div className="card-body">
            <h5 className="card-title mb-4" style={{ color: '#4CD964' }}>Income vs Expenses</h5>
            <CombinedChart data={combinedData} />
          </div>
        </div>

        {/* Charts Row */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              backgroundColor: '#222',
              color: '#fff'
            }}>
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: '#4CD964' }}>Income Breakdown</h5>
                <IncomeChart data={income} />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card h-100" style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              backgroundColor: '#222',
              color: '#fff'
            }}>
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: '#4CD964' }}>Expense Breakdown</h5>
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