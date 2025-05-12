import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import IncomeChart from "../components/IncomeChart";
import IncomeBarChart from "../components/IncomeBarChart";
import { signOut } from "firebase/auth";
import { FiLogOut, FiPlusCircle, FiEdit, FiTrash2, FiDollarSign, FiList, FiPieChart } from "react-icons/fi";

function IncomePage() {
  const [incomeList, setIncomeList] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentIncomeId, setCurrentIncomeId] = useState(null);

  const incomeCategories = {
    Job: ["Base Salary", "Performance Bonus", "Overtime Pay", "Commission"],
    Business: ["E-commerce Sales", "Consulting Fees", "Product Revenue", "Service Contracts"],
    Freelancing: ["Web Development", "Graphic Design", "Content Writing", "Translation Services"],
    Investments: ["Stock Dividends", "Bond Interest", "Rental Income", "Capital Gains"],
    Other: ["Gifts", "Inheritance", "Lottery Winnings", "Royalties"]
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "income"),
          where("userId", "==", currentUser.uid)
        );
        onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setIncomeList(data);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!user || !category || !subCategory) return;
    if (editing) {
      await updateDoc(doc(db, "income", currentIncomeId), {
        amount: parseFloat(amount),
        category,
        subCategory,
        desc,
        createdAt: new Date(),
      });
      setEditing(false);
      setCurrentIncomeId(null);
    } else {
      await addDoc(collection(db, "income"), {
        userId: user.uid,
        amount: parseFloat(amount),
        category,
        subCategory,
        desc,
        createdAt: new Date(),
      });
    }
    setAmount("");
    setCategory("");
    setSubCategory("");
    setDesc("");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "income", id));
  };

  const handleEdit = (income) => {
    setEditing(true);
    setCurrentIncomeId(income.id);
    setAmount(income.amount);
    setCategory(income.category);
    setSubCategory(income.subCategory);
    setDesc(income.desc);
  };

  return (
    <div className="income-page">
      <div className="app-container">
        <Sidebar />
        <div className="content-area">
          <div className="page-header">
            <div className="page-title">
              <FiDollarSign className="header-icon" />
              <h2>{editing ? "Update Income" : "Income Management"}</h2>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut className="icon" /> Logout
            </button>
          </div>

          <div className="form-panel">
            <div className="form-header">
              <h4>{editing ? "Update Income Entry" : "Add New Income"}</h4>
            </div>
            <form onSubmit={handleAddIncome}>
              <div className="form-row">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-icon">
                      <FiDollarSign />
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      id="amountInput"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <label htmlFor="amountInput" className="pt-3 ms-2">Amount (Rs.)</label>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-icon">
                      <FiList />
                    </div>
                    <select
                      className="form-select"
                      id="categorySelect"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubCategory("");
                      }}
                      required
                    >
                      <option value="">Select Category</option>
                      {Object.keys(incomeCategories).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-icon">
                      <FiList />
                    </div>
                    <select
                      className="form-select"
                      id="subCategorySelect"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      required
                      disabled={!category}
                    >
                      <option value="">Select Subcategory</option>
                      {category &&
                        incomeCategories[category]?.map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <button type="submit" className="submit-btn">
                    {editing ? (
                      <><FiEdit className="icon" /> Update</>
                    ) : (
                      <><FiPlusCircle className="icon" /> Add Income</>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <div className="input-group">
                    <textarea
                      className="form-control"
                      placeholder="Description (optional)"
                      id="descriptionTextarea"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="data-panel">
            <div className="panel-header">
              <h4><FiList className="panel-icon" /> Income Records</h4>
            </div>
            <div className="table-container">
              <table className="income-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th className="text-end">Amount</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeList.map((income) => (
                    <tr key={income.id}>
                      <td className="category-cell">{income.category}</td>
                      <td>{income.subCategory}</td>
                      <td className="text-end">Rs. {income.amount.toLocaleString()}</td>
                      <td>
                        <span className="description-text">{income.desc || "-"}</span>
                      </td>
                      <td className="text-end">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(income)}
                        >
                          <FiEdit /> Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(income.id)}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="chart-container">
            <div className="panel-header">
              <h4><FiPieChart className="panel-icon" /> Income Analytics</h4>
            </div>
            <div className="charts-grid">
              <div className="chart-panel">
                <h5>Income Distribution</h5>
                <div className="chart-wrapper">
                  <IncomeChart data={incomeList} />
                </div>
              </div>
              <div className="chart-panel">
                <h5>Income Trends</h5>
                <div className="chart-wrapper">
                  <IncomeBarChart data={incomeList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #121212;
          color: #e0e0e0;
          margin: 0;
          padding: 0;
        }
        
        .income-page {
          --primary-color: #4ade80;
          --primary-hover: #22c55e;
          --accent-color: #16a34a;
          --dark-bg: #121212;
          --card-bg: #1e1e1e;
          --card-hover: #252525;
          --border-color: #333333;
          --text-primary: #e0e0e0;
          --text-secondary: #a0a0a0;
          --danger-color: #ef4444;
          --warning-color: #f59e0b;
          --input-bg: #2a2a2a;
          min-height: 100vh;
        }
        
        .app-container {
          display: flex;
          min-height: 100vh;
        }
        
        .content-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background-color: var(--dark-bg);
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .page-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .header-icon {
          font-size: 1.75rem;
          color: var(--primary-color);
        }
        
        .page-header h2 {
          color: var(--text-primary);
          font-weight: 600;
          margin: 0;
          font-size: 1.75rem;
        }
        
        .logout-btn {
          background-color: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 0.6rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.25);
        }
        
        .icon {
          font-size: 1.1rem;
        }
        
        .panel-icon {
          color: var(--primary-color);
          margin-right: 0.5rem;
        }
        
        .form-panel, .data-panel, .chart-container {
          background-color: var(--card-bg);
          border-radius: 12px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .form-panel:hover, .data-panel:hover, .chart-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .form-header, .panel-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .form-header h4, .panel-header h4 {
          color: var(--text-primary);
          font-weight: 600;
          margin: 0;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
        }
        
        form {
          padding: 1.5rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .form-row:last-child {
          margin-bottom: 0;
        }
        
        .form-group {
          position: relative;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .input-group {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary-color);
          z-index: 1;
        }
        
        .form-control, .form-select {
          width: 100%;
          background-color: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          color: var(--text-primary);
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        textarea.form-control {
          min-height: 100px;
          resize: vertical;
          padding-left: 1rem;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
          outline: none;
        }
        
        .form-control::placeholder {
          color: var(--text-secondary);
        }
        
        .submit-btn {
          background-color: var(--primary-color);
          color: #121212;
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          font-weight: 600;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .submit-btn:hover {
          background-color: var(--primary-hover);
        }
        
        .table-container {
          padding: 0;
          overflow-x: auto;
        }
        
        .income-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .income-table th {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 1rem 1.5rem;
          background-color: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
          text-align: left;
        }
        
        .income-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .income-table tr:hover {
          background-color: var(--card-hover);
        }
        
        .category-cell {
          font-weight: 600;
          color: var(--primary-color);
        }
        
        .description-text {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .text-end {
          text-align: right;
        }
        
        .action-btn {
          background-color: transparent;
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: 0.5rem;
        }
        
        .edit-btn {
          color: var(--warning-color);
          border: 1px solid var(--warning-color);
          background-color: rgba(245, 158, 11, 0.1);
        }
        
        .edit-btn:hover {
          background-color: rgba(245, 158, 11, 0.2);
        }
        
        .delete-btn {
          color: var(--danger-color);
          border: 1px solid var(--danger-color);
          background-color: rgba(239, 68, 68, 0.1);
        }
        
        .delete-btn:hover {
          background-color: rgba(239, 68, 68, 0.2);
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1.5rem;
        }
        
        .chart-panel {
          background-color: var(--card-hover);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .chart-panel h5 {
          text-align: center;
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1rem;
        }
        
        .chart-wrapper {
          height: 300px;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .content-area {
            padding: 1rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default IncomePage;