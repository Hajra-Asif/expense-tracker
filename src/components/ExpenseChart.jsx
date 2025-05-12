import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
 function ExpenseChart({ expenses }) {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return <div className="alert alert-info mt-4">No expense data available for chart.</div>;
  }

  const categoryTotals = expenses.reduce((acc, item) => {
    if (item.category && typeof item.amount === "number") {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
    }
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#81C784", "#BA68C8", "#FF7043", "#26C6DA"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="my-4">
      <h5 className="text-center">Expenses by Category</h5>
      <Pie data={data} />
    </div>
  );
}

export default ExpenseChart;