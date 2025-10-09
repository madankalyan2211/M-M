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
import { checkApiHealth } from './services/healthCheck';
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
  LogOut,
  Wifi,
  WifiOff,
  AlertTriangle
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
  loginTime: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('welcome');
  const [symptomData, setSymptomData] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showPersonalDetailsDialog, setShowPersonalDetailsDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiStatus, setApiStatus] = useState({ online: true, message: 'API connected' });
  const [showApiWarning, setShowApiWarning] = useState(false);

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

  // Check API health on app start
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await api.testConnection();
        setApiStatus({
          online: health.success,
          message: health.message
        });
        
        if (!health.success) {
          console.error('API Health Check Failed:', health.message);
          setShowApiWarning(true);
          
          // Hide warning after 10 seconds
          setTimeout(() => {
            setShowApiWarning(false);
          }, 10000);
        }
      } catch (error) {
        console.error('API Health Check Error:', error);
        setApiStatus({
          online: false,
          message: 'API connection failed'
        });
        setShowApiWarning(true);
      }
    };
    
    checkHealth();
  }, []);

  // Function to toggle dark mode class on document
  const toggleDarkModeClass = (isDark) => {
    // Ensure we start with light mode
    document.documentElement.classList.remove('dark');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  };

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
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleLogin = async (userData: any) => {
    try {
      setCurrentUser(userData);
      setCurrentSection('welcome');
      // Show personal details dialog only if user hasn't completed health profile
      // Check if healthDetails exists and has required fields
      const hasCompletedHealthProfile = userData.healthDetails && 
        Object.keys(userData.healthDetails).length > 0 &&
        userData.healthDetails.height &&
        userData.healthDetails.weight &&
        userData.healthDetails.bloodGroup;
        
      if (!hasCompletedHealthProfile) {
        setShowPersonalDetailsDialog(true);
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
    }
  };

  const handleSaveHealthDetails = async (healthDetails) => {
    if (currentUser) {
      try {
        console.log('Saving health details:', healthDetails);
        
        // Check API health before making request
        const healthCheck = await checkApiHealth();
        if (!healthCheck.success) {
          console.error('API is not healthy:', healthCheck.message);
          // Still attempt to save but log the issue
        }
        
        // Save health details to backend
        const response = await api.updateProfile({ healthDetails });
        console.log('API response:', response);
        
        if (response.success) {
          const updatedUser = {
            ...currentUser,
            healthDetails
          };
          setCurrentUser(updatedUser);
          setShowPersonalDetailsDialog(false);
        } else {
          console.error('Failed to save health details:', response.message);
          // Show error to user
          alert(`Failed to save health details: ${response.message}`);
        }
      } catch (error) {
        console.error('Error saving health details:', error);
        alert(`Error saving health details: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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
      {/* API Warning Banner */}
      {showApiWarning && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-yellow-100 border-b border-yellow-400 text-yellow-800 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>API Connection Issue: {apiStatus.message}</span>
            </div>
            <button 
              onClick={() => setShowApiWarning(false)}
              className="text-yellow-800 hover:text-yellow-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border ${showApiWarning ? 'top-16' : ''}`}>
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

            {/* API Status Indicator */}
            <div className="flex items-center space-x-2">
              {apiStatus.online ? (
                <div className="flex items-center text-green-600 text-sm">
                  <Wifi className="w-4 h-4 mr-1" />
                  <span>API Online</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-sm">
                  <WifiOff className="w-4 h-4 mr-1" />
                  <span>API Offline</span>
                </div>
              )}
            </div>

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
                <span className="text-sm text-muted-foreground">Hi, {currentUser?.name?.split(' ')[0] || 'Guest'}</span>
                {currentUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
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
      <main className={`pt-16 ${showApiWarning ? 'pt-32' : ''}`}>
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