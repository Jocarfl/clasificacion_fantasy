import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { CalculatedStats } from '../../types/fantasy';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

interface AnalyticsViewProps {
  stats: CalculatedStats;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats }) => {
  const { ranking, globalStats } = stats;

  const filteredRanking = ranking.filter(p => p.totalPaid > 0);

  // Palette: amber, emerald, sky, rose, indigo, violet, slate
  const colorPalette = [
    '#f59e0b', '#10b981', '#38bdf8', '#f43f5e', 
    '#818cf8', '#a855f7', '#fb923c', '#2dd4bf', '#94a3b8'
  ];

  // 1. Donut Data
  const donutData = {
    labels: filteredRanking.map(p => p.name),
    datasets: [
      {
        data: filteredRanking.map(p => p.totalPaid),
        backgroundColor: colorPalette.slice(0, filteredRanking.length),
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          padding: 12,
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.raw.toFixed(2)}€ (${((context.raw / globalStats.totalPot) * 100).toFixed(1)}%)`
        }
      }
    },
    cutout: '70%'
  };

  // 2. Bar Chart Data (Penalties Breakdown)
  const barData = {
    labels: ranking.map(p => p.name),
    datasets: [
      {
        label: '9º (3.00€)',
        data: ranking.map(p => p.penaltyCounts.p3),
        backgroundColor: '#ef4444',
        borderRadius: 4
      },
      {
        label: '8º (2.00€)',
        data: ranking.map(p => p.penaltyCounts.p2),
        backgroundColor: '#f97316',
        borderRadius: 4
      },
      {
        label: '7º (1.00€)',
        data: ranking.map(p => p.penaltyCounts.p1),
        backgroundColor: '#eab308',
        borderRadius: 4
      },
      {
        label: '6º (0.50€)',
        data: ranking.map(p => p.penaltyCounts.p05),
        backgroundColor: '#94a3b8',
        borderRadius: 4
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          boxWidth: 12
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#cbd5e1', font: { weight: 'bold' as const, size: 11 } }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { stepSize: 1, color: '#64748b', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-100">
          Estadísticas & Métricas Visuales
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Distribución de pagos y frecuencia de sanciones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart */}
        <div className="rounded-2xl bg-surface/90 border border-surface-border p-6 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-slate-200">
              Reparto del Bote Acumulado
            </h3>
            <span className="text-xs text-amber-400 font-bold">
              {globalStats.totalPot.toFixed(2)}€ Total
            </span>
          </div>
          <div className="h-64 relative">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>

        {/* Penalties Count Bar Chart */}
        <div className="rounded-2xl bg-surface/90 border border-surface-border p-6 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-slate-200">
              Sanciones por Tipo y Jugador
            </h3>
            <span className="text-xs text-slate-400">
              Veces multado
            </span>
          </div>
          <div className="h-64 relative">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};
