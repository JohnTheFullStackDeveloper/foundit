import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import PostLostItem from './components/PostLostItem';
import PostFoundItem from './components/PostFoundItem';
import './App.css';

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'post-lost':
        return <PostLostItem />;
      case 'post-found':
        return <PostFoundItem />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

function AuthFlow() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loading) {
    return (
      <div className='lcu'>
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    );
  }

  if (user) {
    return <AuthenticatedApp />;
  }

  return isLogin ? (
    <Login onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <Register onSwitchToLogin={() => setIsLogin(true)} />
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthFlow />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;