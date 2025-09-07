import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Navigation({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>FoundIt</h1>
          <span className="nav-subtitle">Lost & Found Platform</span>
        </div>
        
        <div className="nav-menu">
          <button
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-button ${activeTab === 'post-lost' ? 'active' : ''}`}
            onClick={() => setActiveTab('post-lost')}
          >
            Post Lost Item
          </button>
          <button
            className={`nav-button ${activeTab === 'post-found' ? 'active' : ''}`}
            onClick={() => setActiveTab('post-found')}
          >
            Post Found Item
          </button>
        </div>
        
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;