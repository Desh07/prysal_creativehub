'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHub, setSelectedHub] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!selectedHub) {
      setError('Please select a hub to manage (Design or Print).');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/admin?site=${selectedHub}`);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-2xl mb-6 shadow-lg">
            <Icons.Lock size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Admin Login</h1>
          <p className="text-gray-500 font-medium">Welcome back to Prysal Printhub</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold text-sm flex items-center space-x-2">
              <Icons.AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none pr-12"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <Icons.EyeOff size={20} /> : <Icons.Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Select Hub to Manage</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedHub('design')}
                className={`p-4 rounded-2xl font-bold flex flex-col items-center justify-center space-y-2 transition-all border-2 ${selectedHub === 'design' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                <Icons.MonitorSmartphone size={24} />
                <span>Design Hub</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedHub('print')}
                className={`p-4 rounded-2xl font-bold flex flex-col items-center justify-center space-y-2 transition-all border-2 ${selectedHub === 'print' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                <Icons.Printer size={24} />
                <span>Print Hub</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white p-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg shadow-black/20 disabled:opacity-50 flex justify-center items-center space-x-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <Icons.ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
