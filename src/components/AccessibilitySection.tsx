import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Palette, 
  Type, 
  Globe, 
  Smartphone, 
  Home as HomeIcon, 
  Wifi, 
  WifiOff,
  Play, 
  Pause, 
  Check,
  Shield,
  Trash2,
  Heart,
  Moon,
  Sun,
  User,
  Speaker,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Link,
  Unlink,
  MessageCircle,
  HelpCircle,
  Zap,
  Home
} from 'lucide-react';

interface AccessibilitySectionProps {
  isDarkMode: boolean;
  onDarkModeToggle: (enabled: boolean) => void;
}

export function AccessibilitySection({ isDarkMode, onDarkModeToggle }: AccessibilitySectionProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState('english');
  const [fontSize, setFontSize] = useState([16]);
  const [selectedAvatar, setSelectedAvatar] = useState('doctor');
  const [highContrast, setHighContrast] = useState(false);
  
  // Voice Assistant States
  const [googleAssistantConnected, setGoogleAssistantConnected] = useState(false);
  const [alexaConnected, setAlexaConnected] = useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(true);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [voiceResponseLevel, setVoiceResponseLevel] = useState([2]); // 1=Brief, 2=Detailed, 3=Comprehensive
  const [smartHomeIntegration, setSmartHomeIntegration] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  // Dark mode is handled by parent App component

  // Apply font size changes
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize[0]}px`);
  }, [fontSize]);

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸' },
    { value: 'spanish', label: 'Español', flag: '🇪🇸' },
    { value: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'tamil', label: 'தமிழ்', flag: '🇮🇳' },
    { value: 'french', label: 'Français', flag: '🇫🇷' },
    { value: 'mandarin', label: '中文', flag: '🇨🇳' }
  ];

  const avatarOptions = [
    { id: 'doctor', name: 'Doctor', icon: '👨‍⚕️', description: 'Professional medical assistant' },
    { id: 'robot', name: 'Robot', icon: '🤖', description: 'Friendly AI companion' },
    { id: 'orb', name: 'Orb', icon: '🔮', description: 'Minimalist design' },
    { id: 'heart', name: 'Heart', icon: '❤️', description: 'Warm and caring' }
  ];

  const handleVoiceOutput = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const clearUserData = () => {
    // In a real app, this would clear all stored user data
    localStorage.clear();
    handleVoiceOutput("All your data has been cleared from this device");
  };

  const handleGoogleAssistantConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGoogleAssistantConnected(!googleAssistantConnected);
    setIsConnecting(false);
    
    if (!googleAssistantConnected) {
      handleVoiceOutput("Google Assistant has been connected to M&M. You can now ask me about your health anytime.");
    } else {
      handleVoiceOutput("Google Assistant has been disconnected from M&M.");
    }
  };

  const handleAlexaConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAlexaConnected(!alexaConnected);
    setIsConnecting(false);
    
    if (!alexaConnected) {
      handleVoiceOutput("Alexa has been connected to M&M. You can now use Alexa to interact with your health assistant.");
    } else {
      handleVoiceOutput("Alexa has been disconnected from M&M.");
    }
  };

  const playVoiceDemo = (demoType: string) => {
    setActiveDemo(demoType);
    
    const demos = {
      'google-basic': "Hey Google, ask M&M about my headache symptoms",
      'google-detailed': "Hey Google, tell M&M I have a fever of 101.2 degrees, headache, and fatigue for the past 2 days",
      'alexa-basic': "Alexa, ask Medical Mate about chest pain",
      'alexa-detailed': "Alexa, tell Medical Mate I'm experiencing shortness of breath after climbing stairs",
      'smart-home': "Your health reminder has been sent to your smart display. Emergency contact has been notified of your missed medication."
    };
    
    handleVoiceOutput(demos[demoType as keyof typeof demos] || "Voice command demo");
    
    setTimeout(() => setActiveDemo(null), 3000);
  };

  const voiceCommands = [
    {
      category: "Health Analysis",
      commands: [
        { trigger: "Hey Google, ask M&M about [symptom]", description: "Start symptom analysis" },
        { trigger: "Hey Google, tell M&M I have [symptoms]", description: "Describe multiple symptoms" },
        { trigger: "Alexa, ask Medical Mate for health advice", description: "General health guidance" },
        { trigger: "Alexa, tell Medical Mate about my pain", description: "Pain assessment" }
      ]
    },
    {
      category: "Health Education",
      commands: [
        { trigger: "Hey Google, ask M&M about diabetes", description: "Learn about conditions" },
        { trigger: "Alexa, ask Medical Mate for medication info", description: "Drug information" },
        { trigger: "Hey Google, tell M&M to explain my diagnosis", description: "Get explanations" }
      ]
    },
    {
      category: "Emergency",
      commands: [
        { trigger: "Hey Google, tell M&M this is urgent", description: "Priority assessment" },
        { trigger: "Alexa, ask Medical Mate for emergency help", description: "Emergency guidance" },
        { trigger: "Hey Google, ask M&M to call for help", description: "Emergency contact" }
      ]
    }
  ];

  // Component is already conditionally rendered by parent

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="min-h-screen bg-background py-16"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-foreground flex items-center justify-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Accessibility & Personalization
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Customize M&M to work best for you. We believe healthcare should be accessible to everyone.
          </p>
        </motion.div>

        {/* Voice Assistant Integration Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-foreground flex items-center gap-2">
                    <Speaker className="w-6 h-6 text-blue-600" />
                    Voice Assistant Integration
                  </h3>
                  <p className="text-muted-foreground">Connect M&M with Google Assistant and Alexa for hands-free health guidance</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Google Assistant */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        <circle cx="12" cy="12" r="8" fill="white" fillOpacity="0.2"/>
                        <circle cx="12" cy="12" r="4" fill="white"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Google Assistant</h4>
                      <p className="text-sm text-muted-foreground">
                        {googleAssistantConnected ? 'Connected & Active' : 'Not Connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {googleAssistantConnected ? (
                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border">
                        <WifiOff className="w-3 h-3 mr-1" />
                        Disconnected
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleGoogleAssistantConnect}
                  disabled={isConnecting}
                  className={`w-full h-12 ${googleAssistantConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isConnecting ? (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {googleAssistantConnected ? <Unlink className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                      <span>{googleAssistantConnected ? 'Disconnect' : 'Connect'} Google Assistant</span>
                    </div>
                  )}
                </Button>

                {googleAssistantConnected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playVoiceDemo('google-basic')}
                        className="flex-1"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Demo Basic
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playVoiceDemo('google-detailed')}
                        className="flex-1"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Demo Advanced
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>Wake phrase:</strong> "Hey Google, ask M&M..." or "Hey Google, tell M&M..."
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Alexa */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        <path d="M12 4a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8zm0 14.5A6.5 6.5 0 0 1 5.5 12 6.5 6.5 0 0 1 12 5.5a6.5 6.5 0 0 1 6.5 6.5 6.5 6.5 0 0 1-6.5 6.5z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Amazon Alexa</h4>
                      <p className="text-sm text-muted-foreground">
                        {alexaConnected ? 'Connected & Active' : 'Not Connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alexaConnected ? (
                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border">
                        <WifiOff className="w-3 h-3 mr-1" />
                        Disconnected
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleAlexaConnect}
                  disabled={isConnecting}
                  className={`w-full h-12 ${alexaConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                >
                  {isConnecting ? (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {alexaConnected ? <Unlink className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                      <span>{alexaConnected ? 'Disconnect' : 'Connect'} Alexa</span>
                    </div>
                  )}
                </Button>

                {alexaConnected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playVoiceDemo('alexa-basic')}
                        className="flex-1"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Demo Basic
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playVoiceDemo('alexa-detailed')}
                        className="flex-1"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Demo Advanced
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Wake phrase:</strong> "Alexa, ask Medical Mate..." or "Alexa, tell Medical Mate..."
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Voice Assistant Settings */}
            {(googleAssistantConnected || alexaConnected) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8 pt-6 border-t border-border"
              >
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-purple-600" />
                  Voice Assistant Settings
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Voice Commands</Label>
                        <p className="text-sm text-gray-600">Enable voice command recognition</p>
                      </div>
                      <Switch
                        checked={voiceCommandsEnabled}
                        onCheckedChange={setVoiceCommandsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Wake Word Detection</Label>
                        <p className="text-sm text-gray-600">Always listen for wake words</p>
                      </div>
                      <Switch
                        checked={wakeWordEnabled}
                        onCheckedChange={setWakeWordEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Smart Home Integration</Label>
                        <p className="text-sm text-gray-600">Connect with smart displays and speakers</p>
                      </div>
                      <Switch
                        checked={smartHomeIntegration}
                        onCheckedChange={setSmartHomeIntegration}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Voice Response Detail Level</Label>
                      <div className="space-y-2">
                        <Slider
                          value={voiceResponseLevel}
                          onValueChange={setVoiceResponseLevel}
                          max={3}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Brief</span>
                          <span className="font-medium">
                            {voiceResponseLevel[0] === 1 ? 'Brief' : 
                             voiceResponseLevel[0] === 2 ? 'Detailed' : 'Comprehensive'}
                          </span>
                          <span>Comprehensive</span>
                        </div>
                      </div>
                    </div>

                    {smartHomeIntegration && (
                      <Button
                        variant="outline"
                        onClick={() => playVoiceDemo('smart-home')}
                        className="w-full"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Test Smart Home Integration
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Voice Commands Reference */}
        {(googleAssistantConnected || alexaConnected) && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Voice Commands Reference
              </h3>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {voiceCommands.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="space-y-4"
                  >
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {category.category}
                    </h4>
                    <div className="space-y-3">
                      {category.commands.map((command, cmdIndex) => (
                        <div key={cmdIndex} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium text-foreground mb-1">
                            "{command.trigger}"
                          </p>
                          <p className="text-xs text-muted-foreground">{command.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Pro Tips</h5>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Speak clearly and at normal pace for better recognition</li>
                      <li>• Use specific medical terms when describing symptoms</li>
                      <li>• Say "repeat that" if you need M&M to say something again</li>
                      <li>• Use "emergency" in your command for urgent situations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Accessibility Settings */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Visual Accessibility
              </h3>
              
              <div className="space-y-6">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? <Moon className="w-5 h-5 text-blue-600" /> : <Sun className="w-5 h-5 text-yellow-600" />}
                    <div>
                      <label className="font-medium">Dark Mode</label>
                      <p className="text-sm text-muted-foreground">Reduce eye strain in low light</p>
                    </div>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={onDarkModeToggle}
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Type className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <label className="font-medium">Font Size</label>
                      <p className="text-sm text-gray-500">Adjust text size for better readability</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={24}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>12px</span>
                      <span className="font-medium">{fontSize[0]}px</span>
                      <span>24px</span>
                    </div>
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <div>
                      <label className="font-medium">High Contrast</label>
                      <p className="text-sm text-gray-500">Enhanced visibility for low vision</p>
                    </div>
                  </div>
                  <Switch
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                Theme & Display
              </h3>
              
              <div className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-600" />
                    )}
                    <div>
                      <label className="font-medium">Dark Mode</label>
                      <p className="text-sm text-muted-foreground">
                        {isDarkMode ? 'Currently using dark theme' : 'Enable dark theme for low-light viewing'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={onDarkModeToggle}
                  />
                </div>

                {/* Theme Preview */}
                <div className="p-4 rounded-lg border-2 bg-card border-border">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">M&M Preview</h4>
                      <p className="text-sm text-muted-foreground">
                        {isDarkMode ? 'Dark theme active' : 'Light theme active'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <div className="w-4 h-4 bg-secondary rounded"></div>
                    <div className="w-4 h-4 bg-accent rounded"></div>
                    <div className="w-4 h-4 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-green-600" />
                Audio Accessibility
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <label className="font-medium">Voice Output</label>
                      <p className="text-sm text-gray-500">Read results and instructions aloud</p>
                    </div>
                  </div>
                  <Switch
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                  />
                </div>

                {voiceEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pl-8 border-l-2 border-blue-200"
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleVoiceOutput("This is how M&M will sound when reading your results. Voice output is now enabled.")}
                      className="w-full"
                    >
                      Test Voice Output
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Personalization Settings */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                Language & Localization
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Preferred Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    M&M supports multiple languages with mBERT-backed translation
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-pink-600" />
                M&M Assistant Personalization
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-3 font-medium">Choose Your M&M Assistant</label>
                  <div className="grid grid-cols-2 gap-3">
                    {avatarOptions.map((avatar) => (
                      <Button
                        key={avatar.id}
                        variant={selectedAvatar === avatar.id ? "default" : "outline"}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className="p-4 h-auto flex flex-col items-center space-y-2"
                      >
                        <div className="text-2xl">{avatar.icon}</div>
                        <div className="text-center">
                          <div className="font-medium">{avatar.name}</div>
                          <div className="text-xs text-gray-500">{avatar.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Data Privacy Dashboard
              </h3>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-800">Privacy Status</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    ✅ No personal data stored on servers<br />
                    ✅ All processing happens locally<br />
                    ✅ Session data cleared automatically
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      // Show data summary
                      alert('Current session: 1 symptom analysis, 0 personal identifiers stored');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View My Data Summary
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={clearUserData}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All My Records
                  </Button>
                </div>

                <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
                  <strong>Note:</strong> M&M is designed for healthcare guidance only. 
                  We do not collect or store personally identifiable information (PII) 
                  or sensitive health data.
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Preview Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Your Personalized M&M Preview
            </h3>
            
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl">
                {avatarOptions.find(a => a.id === selectedAvatar)?.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">M&M Assistant</span>
                  <Badge variant="secondary">
                    {languages.find(l => l.value === language)?.flag} {languages.find(l => l.value === language)?.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  "Hello! I'm your personalized medical companion. I'm ready to help you understand your health with care and precision."
                </p>
              </div>
              {voiceEnabled && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVoiceOutput("Hello! I'm your personalized medical companion. I'm ready to help you understand your health with care and precision.")}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}