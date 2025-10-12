import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './components/ui/button';
import { LoginPage } from './components/LoginPage';
import { PersonalDetailsDialog } from './components/PersonalDetailsDialog';
import { WelcomeSection } from './components/WelcomeSection';
import { SymptomCollection } from './components/SymptomCollection';
import { AIProcessing } from './components/AIProcessing';
import { DiagnosisResults } from './components/DiagnosisResults';
import { EducationSection } from './components/EducationSection';
import { AccessibilitySection } from './components/AccessibilitySection';
import { ProfileSection } from './components/ProfileSection';
import { api } from './services/api';
import { toast } from 'sonner';
import { 
  Heart, 
  Home, 
  Stethoscope, 
  Brain, 
  FileText, 
  BookOpen, 
  Settings,
  ArrowLeft,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';

type AppSection = 'welcome' | 'symptoms' | 'processing' | 'results' | 'education' | 'accessibility' | 'profile';

interface HealthDetails {
  height: string;
  weight: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  allergies: string;
  chronicConditions: string;
  emergencyContact: string;
  preferredUnits: 'metric' | 'imperial';
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  preferences: {
    language: string;
    voiceEnabled: boolean;
    notifications: boolean;
  };
  healthDetails?: HealthDetails;
  hasCompletedProfile: boolean;
  loginTime: string;
}

const navigationItems = [
  { id: 'welcome', label: 'Home', icon: Home },
  { id: 'symptoms', label: 'Symptoms', icon: Stethoscope },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'accessibility', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSection, setCurrentSection] = useState<AppSection>('welcome');
  const [symptomData, setSymptomData] = useState<any>(null);
  const [diagnosisData, setDiagnosisData] = useState<any>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showPersonalDetailsDialog, setShowPersonalDetailsDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Always default to light mode

  // Ensure the app starts in light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Initialize dark mode from localStorage ONLY (no system preference detection)
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    // DEFAULT TO FALSE - only enable if user previously enabled it
    const initialDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;
    
    setIsDarkMode(initialDarkMode);
    toggleDarkModeClass(initialDarkMode);
  }, []);

  // Function to toggle dark mode class on document
  const toggleDarkModeClass = (isDark: boolean) => {
    // Ensure we start with light mode
    document.documentElement.classList.remove('dark');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  };

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Set current user
        const userData: User = {
          id: user._id,
          name: user.name,
          email: user.email,
          healthDetails: user.healthDetails || undefined,
          hasCompletedProfile: user.hasCompletedProfile || false,
          loginTime: new Date().toISOString(),
          preferences: user.preferences || {
            language: 'en',
            voiceEnabled: true,
            notifications: true
          }
        };
        
        setCurrentUser(userData);
        setCurrentSection('welcome');
        
        // Check if user needs to complete their profile
        if (!userData.hasCompletedProfile) {
          setShowPersonalDetailsDialog(true);
        }
        
        // Show welcome message
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      } else {
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  // Handle saving health details
  const handleSaveHealthDetails = async (healthDetails: HealthDetails) => {
    if (!currentUser) return;
    
    try {
      const response = await api.post('/profile/health-details', healthDetails);
      
      if (response.data.success) {
        // Update current user with new health details
        setCurrentUser({
          ...currentUser,
          healthDetails,
          hasCompletedProfile: true
        });
        
        // Close the dialog
        setShowPersonalDetailsDialog(false);
        
        // Show success message
        toast.success('Health details saved successfully!');
      } else {
        toast.error('Failed to save health details. Please try again.');
      }
    } catch (error) {
      console.error('Error saving health details:', error);
      toast.error('An error occurred while saving your health details.');
    }
  };

  // Skip health details
  const handleSkipHealthDetails = () => {
    setShowPersonalDetailsDialog(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentSection('welcome');
    setSymptomData(null);
    setDiagnosisData(null);
    toast.success('Successfully logged out');
  };

  // Update user data
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Navigation handlers
  const handleStartDiagnosis = () => {
    setCurrentSection('symptoms');
  };

  const handleSymptomSubmit = (data: any) => {
    setSymptomData(data);
    setCurrentSection('processing');
  };

  const handleProcessingComplete = (diagnosis: any) => {
    setDiagnosisData(diagnosis);
    setCurrentSection('results');
  };

  const handleNewDiagnosis = () => {
    setSymptomData(null);
    setDiagnosisData(null);
    setCurrentSection('welcome');
  };

  const handleNavigationClick = (sectionId: AppSection) => {
    setCurrentSection(sectionId);
    setShowNavigation(false);
  };

  const canGoBack = currentSection !== 'welcome';

  // Handle dark mode toggle
  const handleDarkModeToggle = (enabled) => {
    setIsDarkMode(enabled);
    toggleDarkModeClass(enabled);
    localStorage.setItem('darkMode', JSON.stringify(enabled));
  };
  const navigationItems = [
    { id: 'welcome', label: 'Home', icon: Home },
    { id: 'symptoms', label: 'Symptoms', icon: Stethoscope },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'accessibility', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Set current user
        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          healthDetails: user.healthDetails || {},
          hasCompletedProfile: user.hasCompletedProfile || false,
          loginTime: new Date().toISOString(),
          preferences: user.preferences || {
            language: 'en',
            voiceEnabled: true,
            notifications: true
          }
        };
        
        setCurrentUser(userData);
        setCurrentSection('welcome');
        
        // Check if user needs to complete their profile
        if (!userData.hasCompletedProfile) {
          setShowPersonalDetailsDialog(true);
        }
        
        // Show welcome message
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      } else {
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  const handleSaveHealthDetails = async (healthDetails: HealthDetails) => {
    if (!currentUser) return;
    
    try {
      const response = await api.post('/profile/health-details', healthDetails);
      
      if (response.data.success) {
        // Update current user with new health details
        setCurrentUser({
          ...currentUser,
          healthDetails,
          hasCompletedProfile: true
        });
        
        // Close the dialog
        setShowPersonalDetailsDialog(false);
        
        // Show success message
        toast.success('Health details saved successfully!');
      } else {
        toast.error('Failed to save health details. Please try again.');
      }
    } catch (error) {
      console.error('Error saving health details:', error);
      toast.error('An error occurred while saving your health details.');
    }
  };

  const handleSkipHealthDetails = () => {
    setShowPersonalDetailsDialog(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSection('welcome');
    setSymptomData(null);
    setDiagnosisData(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleStartDiagnosis = () => {
    setCurrentSection('symptoms');
  };

  const handleSymptomSubmit = (data) => {
    setSymptomData(data);
    setCurrentSection('processing');
  };

  const handleProcessingComplete = (diagnosis) => {
    setDiagnosisData(diagnosis);
    setCurrentSection('results');
  };

  const handleNewDiagnosis = () => {
    setSymptomData(null);
    setDiagnosisData(null);
    setCurrentSection('welcome');
  };

  const handleNavigationClick = (sectionId) => {
    setCurrentSection(sectionId as AppSection);
    setShowNavigation(false);
  };

  const canGoBack = currentSection !== 'welcome';

  // Show login page if user is not authenticated
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">M&M</h1>
                <p className="text-xs text-muted-foreground">Medical Mate</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigationClick(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {/* User Profile & Logout */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
                <span className="text-sm text-muted-foreground">Hi, {currentUser.name.split(' ')[0]}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </nav>

            {/* Mobile Navigation & Back Button */}
            <div className="flex items-center space-x-2">
              {canGoBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (currentSection === 'results') setCurrentSection('symptoms');
                    else if (currentSection === 'processing') setCurrentSection('symptoms');
                    else if (currentSection === 'symptoms') setCurrentSection('welcome');
                    else setCurrentSection('welcome');
                  }}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNavigation(!showNavigation)}
                className="md:hidden"
              >
                {showNavigation ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {showNavigation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-border py-4"
              >
                <div className="grid grid-cols-2 gap-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => handleNavigationClick(item.id)}
                        className="flex items-center justify-center space-x-2 h-12"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {currentSection === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <WelcomeSection 
                onStartDiagnosis={handleStartDiagnosis} 
                hasHealthProfile={!!currentUser?.healthDetails}
              />
            </motion.div>
          )}

          {currentSection === 'symptoms' && (
            <motion.div
              key="symptoms"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <SymptomCollection onSymptomSubmit={handleSymptomSubmit} />
            </motion.div>
          )}

          {currentSection === 'processing' && symptomData && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <AIProcessing 
                symptomData={symptomData} 
                onProcessingComplete={handleProcessingComplete} 
              />
            </motion.div>
          )}

          {currentSection === 'results' && diagnosisData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <DiagnosisResults 
                diagnosis={diagnosisData} 
                onNewDiagnosis={handleNewDiagnosis} 
              />
            </motion.div>
          )}

          {currentSection === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <EducationSection />
            </motion.div>
          )}

          {currentSection === 'accessibility' && (
            <motion.div
              key="accessibility"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <AccessibilitySection 
                isDarkMode={isDarkMode}
                onDarkModeToggle={handleDarkModeToggle}
              />
            </motion.div>
          )}

          {currentSection === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileSection 
                user={currentUser} 
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Personal Details Dialog */}
      <AnimatePresence>
        {showPersonalDetailsDialog && currentUser && (
          <PersonalDetailsDialog
            isOpen={showPersonalDetailsDialog}
            onSave={handleSaveHealthDetails}
            onSkip={handleSkipHealthDetails}
            userName={currentUser.name}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-foreground">M&M - Your Digital Medical Mate</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            M&M provides healthcare guidance through AI analysis, but is not a substitute for professional medical advice. 
            Always consult qualified healthcare providers for serious symptoms or medical decisions.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-muted-foreground">
            <button className="hover:text-foreground transition-colors">Privacy Policy</button>
            <button className="hover:text-foreground transition-colors">Terms of Service</button>
            <button className="hover:text-foreground transition-colors">Medical Disclaimer</button>
          </div>
        </div>
      </footer>
    </div>
  );
}