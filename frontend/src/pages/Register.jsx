import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
      <h1 className="mb-2 text-2xl font-bold text-forest">Create account</h1>
      <p className="mb-6 text-stone-600">Join SmartAgri and build your cultivation plan.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Name</label>
          <input className="w-full rounded-lg border border-stone-300 p-3" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
          <input className="w-full rounded-lg border border-stone-300 p-3" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Password</label>
          <input className="w-full rounded-lg border border-stone-300 p-3" name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-leaf px-4 py-3 font-semibold text-white">Register</button>
      </form>
      <p className="mt-4 text-sm text-stone-600">
        Already have an account? <Link to="/login" className="font-semibold text-forest">Login</Link>
      </p>
    </div>
  );
};

export default Register;
