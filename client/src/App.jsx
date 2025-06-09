import { useState } from 'react';
import Navbar from './components/Navbar';
import UserDashboard from './components/UserDashboard';
import Movies from './components/Movies';

import './App.css';

function App() {
  // User state: null means no user logged in
  const [user, setUser] = useState(null);

  // This function will be called after successful login
  // You should pass it down to your LoginModal component (via Navbar or context)
  const handleLogin = (userData) => {
    setUser(userData);
    // Optionally store token in localStorage if you have one
    // localStorage.setItem('token', userData.token);
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} onLogin={handleLogin} />
      {user ? (
        <UserDashboard user={user} />
      ) : (
        <div className="p-6 text-center text-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Please Log in to access your dashboard.</h2>
        </div>
      )}

      <Movies />
    </>
  );
}

export default App;