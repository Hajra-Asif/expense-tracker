import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const CombinedChart = ({ data }) => {
  // Process data for the combined chart
  const chartData = {
    labels: [...new Set(data.map((item) => item.date))], // Unique dates
    datasets: [
      {
        label: "Income",
        data: data.filter((item) => item.type === "Income").map((item) => item.amount),
        fill: false,
        borderColor: "green",
        tension: 0.1,
      },
      {
        label: "Expense",
        data: data.filter((item) => item.type === "Expense").map((item) => item.amount),
        fill: false,
        borderColor: "red",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h4>Income vs Expense (Combined)</h4>
      <Line data={chartData} />
    </div>
  );
};

export default CombinedChart;
