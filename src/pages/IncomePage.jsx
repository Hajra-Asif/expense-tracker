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
    <div className="income-page" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="d-flex min-vh-100">
        <Sidebar />
        <div className="container-fluid py-4 px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 text-primary fw-bold">{editing ? "Update Income" : "Income Details"}</h2>
            <button
              className="btn btn-outline-danger px-4 py-2 rounded-pill"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </div>

          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <form onSubmit={handleAddIncome}>
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
                        {Object.keys(incomeCategories).map((cat) => (
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
                          incomeCategories[category]?.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                      </select>
                      <label htmlFor="subCategorySelect">Subcategory</label>
                    </div>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold">
                      {editing ? (
                        <><i className="bi bi-pencil-square me-2"></i>Update</>
                      ) : (
                        <><i className="bi bi-plus-circle me-2"></i>Add Income</>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control border-2 border-primary"
                        placeholder="Leave a description here"
                        id="descriptionTextarea"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        style={{ height: "100px" }}
                      ></textarea>
                      <label htmlFor="descriptionTextarea">Description (optional)</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h4 className="mb-0 text-primary fw-bold">My Income Records</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
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
                        <td className="fw-bold">{income.category}</td>
                        <td>{income.subCategory}</td>
                        <td className="text-end">Rs. {income.amount.toLocaleString()}</td>
                        <td>
                          <small className="text-muted">{income.desc || "-"}</small>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-warning me-2 rounded-pill px-3"
                            onClick={() => handleEdit(income)}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleDelete(income.id)}
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

          <div className="card shadow-sm border-0 mb-4">
  <div className="card-header bg-white border-0 py-3">
    <h4 className="mb-0 text-primary fw-bold">Income Visualization</h4>
  </div>
  <div className="card-body">
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card border-0 bg-light p-3 h-100 d-flex flex-column">
          <h5 className="text-center mb-3">Income Distribution</h5>
          <div className="chart-container flex-grow-1" style={{ minHeight: "300px" }}>
            <IncomeChart data={incomeList} />
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card border-0 bg-light p-3 h-100 d-flex flex-column">
          <h5 className="text-center mb-3">Income Trends</h5>
          <div className="chart-container flex-grow-1" style={{ minHeight: "300px" }}>
            <IncomeBarChart data={incomeList} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f8f9fa;
        }
        
        .income-page {
          --primary-color: #4361ee;
          --secondary-color: #3f37c9;
          --accent-color: #4cc9f0;
          --light-color: #f8f9fa;
          --dark-color: #212529;
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
        
        .btn-primary {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }
        
        .btn-primary:hover {
          background-color: var(--secondary-color);
          border-color: var(--secondary-color);
        }
        
        .text-primary {
          color: var(--primary-color) !important;
        }
        
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
        }
        
        .form-control, .form-select {
          border-radius: 8px;
        }
        
        .chart-container {
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default IncomePage;