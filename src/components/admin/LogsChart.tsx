import { FC, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LogEntry {
  action: string;
  timestamp: string;
}

const LogsChart: FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <div className="text-center p-4">Loading chart...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!logs.length) return <div className="text-center p-4">No log data available</div>;

  // Process data for chart
  const today = new Date();
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const loginData = last7Days.map(date => 
    logs.filter(log => 
      log.action === 'login' && 
      log.timestamp.startsWith(date)
    ).length
  );

  const logoutData = last7Days.map(date => 
    logs.filter(log => 
      log.action === 'logout' && 
      log.timestamp.startsWith(date)
    ).length
  );

  const chartData = {
    labels: last7Days.map(date => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: 'Login',
        data: loginData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Logout',
        data: logoutData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Activity Last 7 Days',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="h-[400px] w-full p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LogsChart;