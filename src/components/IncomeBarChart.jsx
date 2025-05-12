import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function IncomeBarChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="alert alert-info mt-4">No income data available for bar chart.</div>;
  }

  const categoryTotals = data.reduce((acc, item) => {
    if (item.category && typeof item.amount === "number") {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Total Income by Category",
        data: Object.values(categoryTotals),
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="my-4">
      <h5 className="text-center">Income Comparison (Bar Chart)</h5>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default IncomeBarChart;
