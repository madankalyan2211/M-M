import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Sparkles,
  UserPlus,
  LogIn,
  ArrowRight,
  CheckCircle,
  Globe,
  Stethoscope,
  AlertCircle,
  Check,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { api } from '../services/api';

// Types
type ViewMode = 'login' | 'register' | 'verify-otp' | 'forgot-password';

interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

interface ApiStatus {
  online: boolean;
  message: string;
}

interface Feature {
  icon: React.FC<{ className?: string }>;
  text: string;
}

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  // Form state
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  
  // OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  // API status
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ 
    online: true, 
    message: 'API connected' 
  });
  
  const features: Feature[] = [
    { icon: Stethoscope, text: "AI-Powered Symptom Analysis" },
    { icon: Shield, text: "Private & Secure" },
    { icon: Globe, text: "Multi-Language Support" },
    { icon: Heart, text: "Personalized Health Insights" }
  ];

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await api.testConnection();
        setApiStatus({
          online: health.success,
          message: health.message
        });
      } catch (error) {
        console.error('API Health Check Error:', error);
        setApiStatus({
          online: false,
          message: 'API connection failed'
        });
      }
    };
    
    checkHealth();
  }, []);

  // Validate password strength
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('one special character');
    return errors;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    
    // Real-time password validation for register mode
    if (field === 'password' && viewMode === 'register') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.login({
        email: formData.email,
        password: formData.password
      });
      
      if (response.success && response.data) {
        setSuccess('Login successful! Redirecting...');
        onLogin(response.data.user || { token: response.data.token });
      } else if (response.requiresVerification) {
        setViewMode('verify-otp');
        setSuccess('Please verify your email address to continue.');
      } else {
        setError(response.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Password strength validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (response.success) {
        setSuccess(response.message || 'Registration successful! Check your email for verification code.');
        setViewMode('verify-otp');
      } else if (response.errors && response.errors.length > 0) {
        setError(response.errors[0].message);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.verifyOTP({
        email: formData.email,
        otp: otpCode
      });
      
      if (response.success) {
        setSuccess('Email verified successfully!');
        setOtp(['', '', '', '', '', '']);
        
        // If there's user data in the response, log them in
        if (response.data?.user || response.data?.token) {
          setTimeout(() => {
            onLogin(response.data?.user || { token: response.data?.token });
          }, 1000);
        } else {
          // If no user data, go to login
          setViewMode('login');
        }
      } else {
        setError(response.message || 'Invalid or expired code. Please try again.');
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('An error occurred while verifying your code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const response = await api.resendOTP(formData.email);
      
      if (response.success) {
        setSuccess(response.message || 'New verification code sent!');
      } else {
        setError(response.message || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input
  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  // Handle OTP paste
  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
  };

  // Handle OTP backspace
  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4">
      {/* API Status Indicator */}
      {!apiStatus.online && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-medium">API Connection Issue</span>
            </div>
            <span className="text-sm">{apiStatus.message}</span>
          </div>
        </div>
      )}

      {/* API Status Icon */}
      <div className="fixed top-4 right-4 z-50">
        {apiStatus.online ? (
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <Wifi className="w-4 h-4 mr-1" />
            <span>API Online</span>
          </div>
        ) : (
          <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            <WifiOff className="w-4 h-4 mr-1" />
            <span>API Offline</span>
          </div>
        )}
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">M&M</h1>
              <p className="text-gray-600">Medical Mate</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <h2 className="text-gray-800">
              Your AI-Powered Health Companion
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Experience personalized medical guidance with clinical precision and emotional warmth. 
              Join thousands who trust M&M for intelligent health insights.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FeatureIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{feature.text}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Badge */}
          <div className="flex items-center space-x-4 pt-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="w-4 h-4 mr-2" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              AI Verified
            </Badge>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">M&M</h1>
                <p className="text-sm text-gray-600">Medical Mate</p>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-gray-800 mb-2">
                {viewMode === 'login' ? 'Welcome Back' : viewMode === 'register' ? 'Join M&M Today' : 'Verify Your Email'}
              </h2>
              <p className="text-gray-600">
                {viewMode === 'login' ? 'Sign in to continue your health journey' : 
                 viewMode === 'register' ? 'Start your personalized health journey' :
                 `We sent a 6-digit code to ${formData.email}`}
              </p>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Buttons - Only show when not in OTP mode */}
            {viewMode !== 'verify-otp' && (
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  type="button"
                  onClick={() => { setViewMode('login'); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'login'
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <LogIn className="w-4 h-4 inline mr-2" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setViewMode('register'); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'register'
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Sign Up
                </button>
              </div>
            )}

            {/* OTP Verification Form */}
            {viewMode === 'verify-otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-center block">Enter Verification Code</Label>
                  <div className="flex justify-center space-x-2" onPaste={handleOTPPaste}>
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Verify Email</span>
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center justify-center space-x-1 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Code</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setViewMode('login'); setOtp(['', '', '', '', '', '']); setError(''); }}
                  className="text-sm text-gray-600 hover:text-gray-800 w-full text-center"
                >
                  Back to Login
                </button>
              </form>
            )}

            {/* Login/Register Forms */}
            {viewMode !== 'verify-otp' && (
              <form onSubmit={viewMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                <AnimatePresence mode="wait">
                  {viewMode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="h-12"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="h-12 pl-10"
                  />
                </div>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="h-12 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password strength indicator for registration */}
                  {viewMode === 'register' && formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 space-y-1"
                    >
                      <p className="text-xs font-medium text-gray-700">Password must have:</p>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { text: 'At least 8 characters', valid: formData.password.length >= 8 },
                          { text: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
                          { text: 'One lowercase letter', valid: /[a-z]/.test(formData.password) },
                          { text: 'One number', valid: /[0-9]/.test(formData.password) }
                        ].map((req, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            {req.valid ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-gray-300" />
                            )}
                            <span className={`text-xs ${
                              req.valid ? 'text-green-700' : 'text-gray-600'
                            }`}>{req.text}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {viewMode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                          className="h-12 pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {viewMode === 'login' && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <button type="button" className="text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 group"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{viewMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            )}

            {/* Privacy Notice */}
            <p className="text-center text-xs text-gray-500 mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy. 
              Your health data is encrypted and secure.
            </p>
          </Card>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Secure Email Verification Enabled
            </Badge>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Image */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMGRvY3RvciUyMHN0ZXRob3Njb3BlfGVufDF8fHx8MTc1OTUxMzk3NHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Medical background"
          className="w-96 h-96 object-cover"
        />
      </div>
    </div>
  );
}