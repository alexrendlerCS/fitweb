"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  mode: 'signup' | 'login';
}

export default function ClientAuthModal({ isOpen, onClose, email, mode }: ClientAuthModalProps) {
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const response = await fetch('/api/client/setup-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName }),
        });

        const data = await response.json();
        if (!response.ok) {
          // Handle specific signup errors
          if (data.error?.includes('already exists')) {
            setError('An account with this email already exists. Please try logging in instead.');
            return;
          }
          setError(data.error || 'Failed to set up account. Please try again.');
          return;
        }

        // After successful signup, redirect to dashboard
        router.push(`/client/dashboard?email=${encodeURIComponent(email)}`);
      } else {
        await handleLogin();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Attempting login for:', email);
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });
      
      if (!response.ok) {
        // Handle specific login errors
        if (response.status === 401) {
          if (data.error?.includes('Invalid email or password')) {
            setError('Incorrect password. Please check your password and try again.');
            return;
          } else if (data.error?.includes('set up your password')) {
            setError('Please set up your password first. Click "Set Up Password" to continue.');
            return;
          }
          setError('Login failed. Please check your credentials and try again.');
          return;
        } else if (response.status === 400) {
          setError('Please enter both email and password.');
          return;
        } else {
          setError(data.error || 'Login failed. Please try again.');
          return;
        }
      }

      console.log('Login successful, redirecting to dashboard...');
      // Redirect to dashboard
      router.push('/client/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white">
            {mode === 'signup' ? 'Set Up Your Account' : 'Login to Dashboard'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-800 border-gray-600 text-gray-300"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-white">
                {mode === 'signup' ? 'Create Password' : 'Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? "Create a password" : "Enter your password"}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10"
                  minLength={mode === 'signup' ? 6 : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-gray-400 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-300 text-sm font-medium">Authentication Error</p>
                    <p className="text-red-200 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password || (mode === 'signup' && !fullName)}
              className="w-full bg-[#004d40] hover:bg-[#00695c]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {mode === 'signup' ? 'Setting up account...' : 'Logging in...'}
                </div>
              ) : (
                mode === 'signup' ? 'Set Up Account' : 'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 