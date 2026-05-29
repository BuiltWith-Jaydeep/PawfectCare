import React from 'react';

const Sidebar = ({ activeSection, setActiveSection, isMobile, isOpen, toggleSidebar }) => {
  // Ensure all props are provided to avoid undefined errors
  if (!setActiveSection || !toggleSidebar) {
    console.error('Sidebar: Required props are missing');
    return null;
  }

  return (
    <>
      {isMobile && (
        <button style={styles.hamburger} onClick={toggleSidebar} aria-label="Toggle Sidebar">
          {isOpen ? '✕' : '☰'}
        </button>
      )}
      <aside
        style={{
          ...styles.sidebar,
          ...(isMobile
            ? isOpen
              ? styles.sidebarMobileOpen
              : styles.sidebarMobileClosed
            : {}),
        }}
      >
        <h2 style={styles.header}>My Account</h2>
        <ul style={styles.list}>
          {['dashboard', 'orders', 'services'].map((section) => (
            <li key={section}>
              <button
                style={activeSection === section ? styles.activeLink : styles.link}
                onClick={() => {
                  setActiveSection(section);
                  if (isMobile) toggleSidebar(); // Close sidebar on mobile
                }}
                aria-label={`Navigate to ${section}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: '70px',
    left: 0,
    width: '220px',
    height: 'calc(100vh - 70px)',
    backgroundColor: '#f0f4f8',
    padding: '30px 20px',
    boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
    zIndex: 900,
  },
  sidebarMobileOpen: {
    transform: 'translateX(0)',
    transition: 'transform 0.3s ease-in-out',
    width: '80%',
    maxWidth: '220px',
  },
  sidebarMobileClosed: {
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
  },
  header: {
    fontFamily: "'Pacifico', cursive",
    fontSize: '24px',
    color: '#14B8A6',
    marginBottom: '30px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: 600,
    padding: '12px 15px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.3s, color 0.3s',
  },
  activeLink: {
    backgroundColor: '#14B8A6',
    color: '#fff',
    fontWeight: 600,
    padding: '12px 15px',
    borderRadius: '8px',
  },
  hamburger: {
    position: 'fixed',
    top: '15px',
    left: '15px',
    background: '#14B8A6',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    fontSize: '24px',
    borderRadius: '8px',
    cursor: 'pointer',
    zIndex: 1100,
  },
};

export default Sidebar;