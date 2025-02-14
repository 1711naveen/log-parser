"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Histogram({ title, data, labels }) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <Bar
        data={{
          labels,
          datasets: [{ label: title, data, backgroundColor: "rgba(75,192,192,0.6)" }],
        }}
        options={{ responsive: true }}
      />
    </div>
  );
}
