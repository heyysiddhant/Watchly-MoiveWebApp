import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

export default function Navbar({ user, onLogin, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user || null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // 🔁 Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Assuming you save user data on login

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        onLogin && onLogin(parsedUser); // notify parent if needed
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    onLogout && onLogout(); // notify parent if needed
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold tracking-wide">MovieZone</h1>

      {currentUser ? (
        <div className="flex items-center space-x-4">
          <span>
            Welcome, <strong>{currentUser.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
          >
            Log In
          </button>
          <button
            onClick={() => setShowSignUpModal(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium"
          >
            Sign Up
          </button>
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          closeModal={() => setShowLoginModal(false)}
          onLogin={(userData) => {
            localStorage.setItem('user', JSON.stringify(userData));
            setCurrentUser(userData);
            onLogin && onLogin(userData);
            setShowLoginModal(false);
          }}
        />
      )}

      {showSignUpModal && (
        <SignUpModal
          closeModal={() => setShowSignUpModal(false)}
          onSignUp={(userData) => {
            localStorage.setItem('user', JSON.stringify(userData));
            setCurrentUser(userData);
            onLogin && onLogin(userData);
            setShowSignUpModal(false);
          }}
        />
      )}
    </nav>
  );
}
