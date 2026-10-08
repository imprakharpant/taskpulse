import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Layers, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(72, 'Password cannot exceed 72 characters')
});

export const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError('');
      await registerAuth(data);
      navigate('/dashboard');
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e) => {
          setError(e.field, { message: e.message });
        });
      } else {
        setServerError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
            Create your account
          </h1>
          <p className="text-sm text-slate-400">
            One account synchronizes across Web and Android mobile.
          </p>
        </div>

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
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Morgan"
              error={errors.fullName}
              {...register('fullName')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              error={errors.email}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
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
              Create Account
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
