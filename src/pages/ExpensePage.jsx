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
    <div className="expense-page" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="d-flex min-vh-100">
        <Sidebar />
        <div className="container-fluid py-4 px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 text-gradient fw-bold">
              {editingExpense ? "Edit Expense" : "Expense Tracker"}
            </h2>
            <button
              className="btn btn-outline-danger px-4 py-2 rounded-pill"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </div>

          {/* Expense Form Card */}
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control border-2 border-primary"
                        id="amountInput"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                      <label htmlFor="amountInput">Amount (Rs.)</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <select
                        className="form-select border-2 border-primary"
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
                        className="form-select border-2 border-primary"
                        id="subCategorySelect"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        required
                        disabled={!category}
                      >
                        <option value="">Select Subcategory</option>
                        {category &&
                          expenseCategories[category]?.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                      </select>
                      <label htmlFor="subCategorySelect">Subcategory</label>
                    </div>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-gradient w-100 py-3 rounded-pill fw-bold">
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
                        className="form-control border-2 border-primary"
                        id="noteInput"
                        placeholder="Note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <label htmlFor="noteInput">Note (optional)</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Expense Records Card */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h4 className="mb-0 text-gradient fw-bold">Expense Records</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
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
                          <small className="text-muted">{expense.note || "-"}</small>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-warning me-2 rounded-pill px-3"
                            onClick={() => handleEdit(expense)}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
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
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h4 className="mb-0 text-gradient fw-bold">Expense Analytics</h4>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="card border-0 bg-light p-3 h-100 d-flex flex-column">
                    <h5 className="text-center mb-3">Expense Distribution</h5>
                    <div className="chart-container flex-grow-1" style={{ minHeight: "300px" }}>
                      <ExpenseChart expenses={expenses} />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card border-0 bg-light p-3 h-100 d-flex flex-column">
                    <h5 className="text-center mb-3">Expense Trends</h5>
                    <div className="chart-container flex-grow-1" style={{ minHeight: "300px" }}>
                      <ExpenseBarChart data={expenses} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f8f9fa;
        }
        
        .expense-page {
          --primary-color: #6a11cb;
          --secondary-color: #2575fc;
          --light-color: #f8f9fa;
          --dark-color: #212529;
        }
        
        .text-gradient {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .btn-gradient {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          color: white;
          border: none;
        }
        
        .btn-gradient:hover {
          background: linear-gradient(45deg, #5a0cb0, #1a65e0);
          color: white;
        }
        
        .card {
          border-radius: 12px;
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .form-control, .form-select {
          border-radius: 8px;
        }
        
        .chart-container {
          position: relative;
        }
        
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}

export default ExpensePage;