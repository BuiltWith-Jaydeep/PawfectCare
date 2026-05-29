import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const data = {
    labels: ['Users', 'Orders', 'Consultations', 'Groomings', 'Adoptions', 'Daycare', 'Vaccinations'],
    datasets: [
      {
        label: 'Count',
        data: [5, 20, 7, 8, 6, 9, 5], 
        backgroundColor: '#00b4d8',
        borderColor: '#0096b1',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#fff' } },
      title: { display: true, text: 'PawfectCare Overview', color: '#fff', font: { size: 20 } },
    },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' }, beginAtZero: true },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={styles.dashboard}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1>Admin Dashboard</h1>
      <div className={styles.chartContainer}>
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
}

export default Dashboard;