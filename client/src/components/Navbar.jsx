import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar({ user, onLogin, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user || null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        onLogin && onLogin(parsedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    onLogout && onLogout();
  };
//heyysiddhant
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#121212] text-white px-6 py-4 flex justify-between items-center shadow-md border-b border-gray-800">
      {/* Brand */}
      <div className="text-2xl font-bold tracking-tight">
        <span className="text-indigo-400">Watch</span>
        <span className="text-pink-500">ly</span>
      </div>

      {currentUser ? (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-200">
            <FaUserCircle className="text-xl text-gray-400" />
            <span className="text-sm md:text-base">
              Welcome, <strong className="text-white">{currentUser.name}</strong>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-full text-sm font-medium"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-3">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-full text-sm font-medium"
          >
            Log In
          </button>
          <button
            onClick={() => setShowSignUpModal(true)}
            className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-full text-sm font-medium"
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
