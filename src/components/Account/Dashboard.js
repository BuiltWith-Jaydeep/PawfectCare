import React, { useState } from 'react';
import ManageAccount from './ManageAccount';
import ManagePet from './ManagePet';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        <button
          style={activeTab === 'account' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('account')}
          aria-label="Manage Account"
        >
          Manage Account
        </button>
        <button
          style={activeTab === 'pet' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('pet')}
          aria-label="Manage Pet"
        >
          Manage Pet
        </button>
      </div>
      <div style={styles.content}>
        {activeTab === 'account' && <ManageAccount />}
        {activeTab === 'pet' && <ManagePet />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    borderBottom: '2px solid #e0e0e0',
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '10px 25px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#666',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  activeTab: {
    background: 'none',
    border: 'none',
    padding: '10px 25px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#14B8A6',
    borderBottom: '3px solid #14B8A6',
    cursor: 'pointer',
  },
  content: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
};

export default Dashboard;