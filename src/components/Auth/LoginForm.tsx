import React, { useState } from 'react';
import { User, LogIn, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRegistrationForm } from '../UserManagement/UserRegistrationForm';

export function LoginForm() {
  const { state, dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = state.users.find(u => u.email === email);
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
    }
  };

  const quickLogin = (userEmail: string) => {
    const user = state.users.find(u => u.email === userEmail);
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">NWI B2B</h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg font-bold">NEW WORLD INNOVATIONS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 lg:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm lg:text-base"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 lg:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm lg:text-base"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 lg:py-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm lg:text-base"
          >
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
            Sign In
          </button>
        </form>

        {/* Admin Setup for Clean Database */}
        <div className="mt-6 sm:mt-8 lg:mt-10 border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 lg:mb-6 text-center">First Time Setup</h3>
          <button
            onClick={() => {
              // Create initial admin user for clean database
              const adminUser = {
                id: 'admin-1',
                name: 'System Administrator',
                email: 'admin@nwi.com',
                role: 'admin' as const,
                businessName: 'NWI Platform',
                phone: '+27 11 123 4567',
                address: 'Johannesburg, South Africa',
                verified: true,
                status: 'active' as const,
                createdAt: new Date().toISOString()
              };
              dispatch({ type: 'ADD_USER', payload: adminUser });
              dispatch({ type: 'SET_USER', payload: adminUser });
            }}
            className="w-full text-xs sm:text-sm bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 px-2 sm:px-3 lg:px-4 py-2 lg:py-3 rounded-lg sm:rounded-xl border border-purple-200 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Create Initial Admin (First Time Only)
          </button>
        </div>

        {/* Registration Option */}
        <div className="mt-6 sm:mt-8 lg:mt-10 border-t pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Don't have an account?</p>
            <button
              onClick={() => setShowRegistration(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 lg:py-4 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm lg:text-base mb-3"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              Sign Up as Wholesaler or Retailer
            </button>
            <p className="text-xs text-gray-500">
              Applications require admin approval
            </p>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 lg:mt-10">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 lg:mb-6 text-center">Quick Login (Demo)</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => quickLogin('john@wholesale.com')}
              className="text-xs sm:text-sm bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-2 sm:px-3 lg:px-4 py-2 lg:py-3 rounded-lg sm:rounded-xl border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Wholesaler
            </button>
            <button
              onClick={() => quickLogin('mary@spaza.com')}
              className="text-xs sm:text-sm bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 px-2 sm:px-3 lg:px-4 py-2 lg:py-3 rounded-lg sm:rounded-xl border border-orange-200 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Retailer
            </button>
            <button
              onClick={() => quickLogin('admin@nwi.com')}
              className="text-xs sm:text-sm bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 px-2 sm:px-3 lg:px-4 py-2 lg:py-3 rounded-lg sm:rounded-xl border border-purple-200 hover:from-purple-100 hover:to-violet-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin('support@nwi.com')}
              className="text-xs sm:text-sm bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-2 sm:px-3 lg:px-4 py-2 lg:py-3 rounded-lg sm:rounded-xl border border-blue-200 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Support
            </button>
          </div>
        </div>
      </div>
      
      <UserRegistrationForm 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)} 
      />
    </div>
  );
}