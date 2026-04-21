import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Lock, User } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    // Controlled credentials: IKODAWA / IKODAWA@321
    setTimeout(() => {
      if (username === 'IKODAWA' && password === 'IKODAWA@321') {
        onLogin();
      } else {
        setError('Invalid username or password. Please try again.');
        setIsLoggingIn(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative z-20">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-8 md:p-12 shadow-sm relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--accent)] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Admin Portal</h1>
          <p className="text-[var(--text-muted)] text-sm mt-2">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-10 py-3 text-slate-900 focus:outline-none focus:border-[var(--accent)] transition-colors text-sm placeholder:text-slate-400" 
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-10 py-3 text-slate-900 focus:outline-none focus:border-[var(--accent)] transition-colors text-sm placeholder:text-slate-400" 
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-600 text-xs font-semibold text-center bg-red-50 py-2.5 rounded-lg border border-red-100"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-[var(--accent)] hover:opacity-90 disabled:bg-slate-400 text-white flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-opacity"
          >
            {isLoggingIn ? (
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                />
            ) : (
                <>
                    <span>ACCESS DASHBOARD</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <button 
          onClick={onBack}
          className="w-full mt-6 text-gray-400 hover:text-gray-900 text-sm font-bold transition-colors uppercase tracking-widest"
        >
          Return to Site
        </button>
      </motion.div>
    </div>
  );
};
