import React, { useState, useEffect } from 'react';
import TopNav from '../components/Common/TopNav';
import Sidebar from '../components/Common/Sidebar';
import Dashboard from '../components/Account/Dashboard';
import Orders from '../components/Account/Orders';
import Services from '../components/Account/Services';
import Subscription from '../components/Account/Subscription';
import './MyAccountPage.css';

const MyAccountPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      if (!mobileView) setIsSidebarOpen(false); // Close sidebar on desktop view
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar for mobile view
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Ensure all components are available
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'services':
        return <Services />;
      case 'subscription':
        return <Subscription />;
      default:
        return <div style={styles.error}>Section not found</div>;
    }
  };

  return (
    <div style={styles.page}>
      <TopNav />
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {isMobile && isSidebarOpen && (
        <div style={styles.overlay} onClick={toggleSidebar} aria-hidden="true"></div>
      )}
      <main
        style={{
          ...styles.main,
          ...(isMobile ? {} : { marginLeft: '220px' }),
          width: isMobile ? '100%' : 'calc(100% - 220px)',
        }}
      >
        {renderSection()}
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    overflowX: 'hidden',
  },
  main: {
    paddingTop: '70px',
    paddingBottom: '30px',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    transition: 'margin-left 0.3s ease-in-out', // Smooth transition for sidebar
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 800,
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#e63946',
    padding: '20px',
  },
};

export default MyAccountPage;