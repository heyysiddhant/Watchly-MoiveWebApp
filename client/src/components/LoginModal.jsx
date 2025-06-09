import { useState } from 'react';
import axios from 'axios';

export default function LoginModal({ closeModal, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', form);

    // ✅ Save the token to localStorage
    localStorage.setItem('token', res.data.token);

    setSuccess(res.data.message);
    onLogin(res.data.user); // Optional: pass user info to parent
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Login
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}