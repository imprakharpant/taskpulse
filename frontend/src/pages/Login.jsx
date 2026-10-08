import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Layers, AlertCircle, Clock, Key } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSessionExpired = searchParams.get('expired') === '1';

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError('');
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'demo@example.com', { shouldValidate: true });
    setValue('password', 'Password123!', { shouldValidate: true });
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-950 mb-2">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Sign in to Task<span className="text-indigo-400">Pulse</span>
          </h1>
          <p className="text-sm text-slate-400">
            Manage projects, collaborate on tasks, and track productivity.
          </p>
        </div>

        {/* Session Expired Banner */}
        {isSessionExpired && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs flex items-start gap-3 animate-fadeIn">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Session Expired</p>
              <p className="text-amber-400/90 mt-0.5">
                Your login session has expired. Please log in again to continue.
              </p>
            </div>
          </div>
        )}

        {/* Card Form */}
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-sm">
          {serverError && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-950/40 border border-rose-900/80 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/30 hover:bg-indigo-950/50 border border-indigo-900/50 rounded-lg transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              Use Seeded Demo Credentials (demo@example.com)
            </button>
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
