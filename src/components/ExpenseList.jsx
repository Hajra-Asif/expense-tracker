export default function ExpenseList({ expenses, onDelete }) {
    return (
      <div>
        <h4>Your Expenses</h4>
        <ul className="list-group">
          {expenses.map((exp) => (
            <li key={exp.id} className="list-group-item d-flex justify-content-between">
              <div>
                {exp.desc} (${exp.amount}) - {exp.category}
              </div>
              <button onClick={() => onDelete(exp.id)} className="btn btn-sm btn-danger">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  