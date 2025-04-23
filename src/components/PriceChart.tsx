import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
  type?: 'line' | 'bar';
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({
  title,
  labels,
  datasets,
  type = 'line',
  height = 300
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        }
      },
    },
  };

  const chartData = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.borderColor || (type === 'line' ? '#10b981' : undefined),
      backgroundColor: dataset.backgroundColor || (type === 'line' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.6)'),
      tension: 0.3,
    })),
  };

  return (
    <div style={{ height: `${height}px` }} className="bg-white p-4 rounded-lg shadow-md">
      {type === 'line' ? (
        <Line options={options} data={chartData} />
      ) : (
        <Bar options={options} data={chartData} />
      )}
    </div>
  );
};

export default PriceChart;