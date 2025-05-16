import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseBarChart from "../components/ExpenseBarChart";

function ExpensePage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const expenseCategories = {
    Bill: ["Electricity", "Natural Gas", "Water & Sewage", "Internet", "Mobile Phone", "Streaming Services"],
    Food: ["Groceries", "Dining Out", "Coffee Shops", "Drinks", "Work Lunches", "Food Delivery"],
    Travel: ["Gasoline", "Public Transport", "Ride Sharing", "Car Payment", "Car Insurance", "Parking Fees"],
    Shopping: ["Clothing", "Electronics", "Home Goods", "Gifts", "Books", "Hobby Supplies"],
    Other: ["Healthcare", "Education", "Charity", "Subscriptions", "Pet Care", "Repairs"]
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "expenses"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !subCategory)
      return alert("Please fill all fields");

    if (editingExpense) {
      const expenseRef = doc(db, "expenses", editingExpense.id);
      await updateDoc(expenseRef, {
        amount: parseFloat(amount),
        category,
        subCategory,
        note,
      });
      setEditingExpense(null);
    } else {
      await addDoc(collection(db, "expenses"), {
        userId,
        amount: parseFloat(amount),
        category,
        subCategory,
        note,
        date: new Date().toISOString(),
      });
    }

    setAmount("");
    setCategory("");
    setSubCategory("");
    setNote("");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount);
    setCategory(expense.category);
    setSubCategory(expense.subCategory);
    setNote(expense.note);
  };

  return (
    <div className="expense-page">
      <div className="d-flex min-vh-100">
        <Sidebar />
        <div className="main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 text-accent fw-bold">
              {editingExpense ? "Edit Expense" : "Expense Tracker"}
            </h2>
            <button
              className="btn btn-logout px-3 py-2"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </div>

          {/* Expense Form Card */}
          <div className="card form-card mb-4">
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="amountInput"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <label htmlFor="amountInput" className="text-light">Amount (Rs.)</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating">
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
                      {Object.keys(expenseCategories).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <label htmlFor="categorySelect">Category</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="subCategorySelect"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      required
                      disabled={!category}
                    >
                      <option value="" className="text-dark">Select Subcategory</option>
                      {category &&
                        expenseCategories[category]?.map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                    <label htmlFor="subCategorySelect">Subcategory</label>
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button 
                    className="btn btn-accent w-100 py-3"
                    onClick={handleSubmit}
                  >
                    {editingExpense ? (
                      <><i className="bi bi-pencil-square me-2"></i>Update</>
                    ) : (
                      <><i className="bi bi-plus-circle me-2"></i>Add Expense</>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="row mt-3">
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="noteInput"
                      placeholder="Note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <label htmlFor="noteInput">Note (optional)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Records Card */}
          <div className="card table-card mb-4">
            <div className="card-header">
              <h4 className="mb-0 text-accent fw-bold">Expense Records</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Subcategory</th>
                      <th className="text-end">Amount</th>
                      <th>Note</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="fw-bold">{expense.category}</td>
                        <td>{expense.subCategory}</td>
                        <td className="text-end">Rs. {expense.amount.toLocaleString()}</td>
                        <td>
                          <small className="text-secondary">{expense.note || "-"}</small>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-edit me-2"
                            onClick={() => handleEdit(expense)}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="card chart-card mb-4">
            <div className="card-header">
              <h4 className="mb-0 text-accent fw-bold">Expense Analytics</h4>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="chart-container">
                    <h5 className="text-center mb-3 text-light">Expense Distribution</h5>
                    <div style={{ height: "300px" }}>
                      <ExpenseChart expenses={expenses} />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="chart-container">
                    <h5 className="text-center mb-3 text-light">Expense Trends</h5>
                    <div style={{ height: "300px" }}>
                      <ExpenseBarChart data={expenses} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
          --bg-dark: #121212;
          --bg-card: #1e1e1e;
          --bg-card-hover: #252525;
          --text-primary: #e0e0e0;
          --text-secondary: #a0a0a0;
          --accent-primary: #4CAF50;
          --accent-secondary: #2E7D32;
          --border-color: #333333;
          --input-bg: #2d2d2d;
          --input-border: #3d3d3d;
          --header-bg: #1a1a1a;
        }
        
        .expense-page {
          background-color: var(--bg-dark);
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
        }
        
        .main-content {
          width: 100%;
          max-height: 100vh;
          overflow-y: auto;
        }
        
        .text-accent {
          color: var(--accent-primary);
        }
        
        .card {
          background-color: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          background-color: var(--header-bg);
          border-bottom: 1px solid var(--border-color);
          padding: 1rem 1.5rem;
        }
        
        .form-card {
          border-left: 4px solid var(--accent-primary);
        }
        
        .chart-card {
          border-left: 4px solid var(--accent-secondary);
        }
        
        .table-card {
          border-left: 4px solid #5c6bc0;
        }
        
        .form-control, .form-select {
          background-color: var(--input-bg);
          border: 1px solid var(--input-border);
          color: var(--text-primary);
          border-radius: 8px;
        }
        
        .btn-accent {
          background-color: var(--accent-primary);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .btn-accent:hover {
          background-color: var(--accent-secondary);
          color: #ffffff;
          transform: translateY(-2px);
        }
        
        .btn-logout {
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid #d32f2f;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .btn-logout:hover {
          background-color: #d32f2f;
          color: #ffffff;
        }
        
        .btn-edit {
          background-color: transparent;
          color: #ff9800;
          border: 1px solid #ff9800;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .btn-edit:hover {
          background-color: #ff9800;
          color: #ffffff;
        }
        
        .btn-delete {
          background-color: transparent;
          color: #f44336;
          border: 1px solid #f44336;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .btn-delete:hover {
          background-color: #f44336;
          color: #ffffff;
        }
        
        .table {
          color: var(--text-primary);
          border-collapse: separate;
          border-spacing: 0;
        }
        
        .table th {
          background-color: var(--header-bg);
          color: var(--accent-primary);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1px;
          border-bottom: none;
          padding: 1rem;
        }
        
        .table td {
          border-top: 1px solid var(--border-color);
          padding: 1rem;
        }
        
        .table tbody tr {
          transition: background-color 0.2s ease;
        }
        
        .table tbody tr:hover {
          background-color: var(--bg-card-hover);
        }
        
        .chart-container {
          background-color: var(--bg-card-hover);
          border-radius: 10px;
          padding: 1.5rem;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

export default ExpensePage;