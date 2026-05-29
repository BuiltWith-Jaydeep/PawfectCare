import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import AdminIntroAnimation from './components/AdminIntroAnimation';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Services from './pages/Services';
import styles from './styles/AdminPanel.module.css';

function AdminPanel() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <div className={styles.adminPanel}>
      <AnimatePresence mode="wait">
        {!isIntroComplete ? (
          <AdminIntroAnimation
            key="admin-intro"
            onAnimationComplete={() => setIsIntroComplete(true)}
          />
        ) : (
          <div className={styles.layout}>
            <Sidebar />
            <main className={styles.mainContent}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="orders" element={<Orders />} />
                <Route path="services/*" element={<Services />} />
              </Routes>
            </main>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminPanel;