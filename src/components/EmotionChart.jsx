import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EmotionChart({ emotionData }) {
  const [chartData, setChartData] = useState({
    labels: ['happy', 'neutral', 'angry', 'sad', 'surprised', 'disgusted', 'fearful'],
    datasets: [],
  });

  useEffect(() => {
    const labels = ['happy', 'neutral', 'angry', 'sad', 'surprised', 'disgusted', 'fearful'];
    let datasets = [];

    Object.entries(emotionData).forEach(([person, emotions], i) => {
      if (!emotions) return;
      const data = labels.map((label) => emotions[label] || 0);
      datasets.push({
        label: person,
        data,
        backgroundColor: `hsl(${(i * 60) % 360}, 70%, 50%)`,
      });
    });

    setChartData({
      labels,
      datasets,
    });
  }, [emotionData]);

  return (
    <div className="emotion-chart">
      <h2>Emociones en tiempo real</h2>
      {chartData.datasets.length === 0 ? (
        <p>No hay datos para mostrar</p>
      ) : (
        <Bar data={chartData} />
      )}
    </div>
  );
}
