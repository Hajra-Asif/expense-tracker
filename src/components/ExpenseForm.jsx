import { useState } from "react";

export default function ExpenseForm({ onAdd }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ desc, amount: +amount, category });
    setDesc("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <input className="form-control mb-2" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" required />
      <input className="form-control mb-2" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" required />
      <select className="form-control mb-2" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Other</option>
      </select>
      <button className="btn btn-success">Add Expense</button>
    </form>
  );
}
