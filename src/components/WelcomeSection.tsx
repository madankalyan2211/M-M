import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Shield, 
  Mic, 
  MessageCircle, 
  Play, 
  Brain,
  Stethoscope,
  User,
  Globe,
  BookOpen,
  Zap,
  Eye,
  Clock,
  AlertTriangle,
  Target,
  Activity,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WelcomeSectionProps {
  onStartDiagnosis: () => void;
  hasHealthProfile?: boolean;
}

export function WelcomeSection({ onStartDiagnosis, hasHealthProfile = false }: WelcomeSectionProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const featureTimer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(featureTimer);
  }, []);

  const getTimeOfDayGradient = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) {
      return 'from-sky-200 to-blue-300'; // Morning
    } else if (hour >= 12 && hour < 18) {
      return 'from-blue-300 to-blue-400'; // Afternoon
    } else if (hour >= 18 && hour < 22) {
      return 'from-blue-400 to-blue-500'; // Evening
    } else {
      return 'from-blue-600 to-blue-800'; // Night
    }
  };

  const features = [
    {
      icon: Stethoscope,
      title: "Multi-Modal Symptom Collection",
      description: "Text, voice, visual body map, and checklist inputs",
      color: "from-blue-500 to-blue-600",
      highlight: "4 Input Methods"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced ML models with medical knowledge retrieval",
      color: "from-purple-500 to-purple-600",
      highlight: "Real-time Processing"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Detection",
      description: "Instant urgency assessment with FAST stroke protocols",
      color: "from-red-500 to-red-600",
      highlight: "Life-saving Alerts"
    },
    {
      icon: Target,
      title: "Confidence Scoring",
      description: "Transparent AI reasoning with probability rankings",
      color: "from-green-500 to-green-600",
      highlight: "85% Accuracy"
    },
    {
      icon: BookOpen,
      title: "Health Education",
      description: "Interactive quizzes and medical knowledge base",
      color: "from-indigo-500 to-indigo-600",
      highlight: "Learn & Grow"
    },
    {
      icon: Globe,
      title: "Accessible Design",
      description: "Multi-language support with voice output options",
      color: "from-teal-500 to-teal-600",
      highlight: "6+ Languages"
    }
  ];

  const stats = [
    { label: "Symptoms Analyzed", value: "10,000+", icon: Activity },
    { label: "Medical References", value: "500+", icon: BookOpen },
    { label: "Languages Supported", value: "6+", icon: Globe },
    { label: "AI Confidence", value: "85%", icon: Brain }
  ];

  const handleVoiceInput = () => {
    setIsVoiceMode(!isVoiceMode);
    // Voice synthesis for welcome message
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Hi, I'm M&M, your digital medical mate. Tell me how you're feeling today."
      );
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic gradient header */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getTimeOfDayGradient()} opacity-10`} />
      
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* AI Avatar Doctor */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotateY: [0, 15, -15, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl ${
                hasHealthProfile 
                  ? 'bg-gradient-to-br from-red-500 to-pink-600' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}
            >
              <motion.div
                animate={hasHealthProfile ? {
                  scale: [1, 1.2, 1, 1.1, 1],
                  rotate: [0, -5, 5, 0]
                } : {}}
                transition={hasHealthProfile ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              >
                <Heart 
                  className={`w-16 h-16 ${hasHealthProfile ? 'text-white fill-current' : 'text-white'}`} 
                />
              </motion.div>
              
              {/* Health Profile Complete Animation */}
              {hasHealthProfile && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 0.7, 0] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 rounded-full bg-red-300 -z-10"
                  />
                  
                  {/* Sparkle effects */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, (Math.cos(i * 60 * Math.PI / 180) * 50)],
                        y: [0, (Math.sin(i * 60 * Math.PI / 180) * 50)]
                      }}
                      transition={{ 
                        duration: 1.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
            
            {/* Floating medical icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-sky-200 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-sky-300 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-12 max-w-3xl"
        >
          <h1 className="mb-4 text-gray-800">
            Hi, I'm <span className="text-blue-600">M&M</span> 👋
          </h1>
          <p className="text-gray-600 mb-6">
            Your digital medical mate. I'm here to help you understand your symptoms with clinical precision and emotional warmth.
            {hasHealthProfile ? 
              " Your health profile is complete - I'm ready to provide personalized insights!" :
              " Tell me how you're feeling today."
            }
          </p>
          
          {/* Health Profile Status */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              We don't store personal data
            </Badge>
            
            {hasHealthProfile && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Health Profile Complete
                  <Sparkles className="w-4 h-4 ml-2" />
                </Badge>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Smart Welcome Assistant */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-2xl mb-12"
        >
          <Card className="p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button
                onClick={handleVoiceInput}
                variant={isVoiceMode ? "default" : "outline"}
                size="lg"
                className="flex-1"
              >
                <Mic className="w-5 h-5 mr-2" />
                Voice Mode
              </Button>
              <Button
                onClick={onStartDiagnosis}
                variant={!isVoiceMode ? "default" : "outline"}
                size="lg"
                className="flex-1"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Text Mode
              </Button>
            </div>

            {isVoiceMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-center"
              >
                <div className="flex justify-center items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scaleY: [1, 2, 1],
                        backgroundColor: ["#3B82F6", "#60A5FA", "#3B82F6"]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                      className="w-2 h-8 bg-blue-500 mx-1 rounded-full"
                    />
                  ))}
                </div>
                <p className="text-gray-600">Listening... Speak naturally about your symptoms</p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-16"
        >
          <Button 
            onClick={onStartDiagnosis}
            size="lg" 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Start Diagnosis
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Try Demo
          </Button>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section className="relative z-10 bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-gray-800 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-600" />
              Powered by Advanced Medical AI
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              M&M combines cutting-edge artificial intelligence with medical expertise to provide you with intelligent, 
              accessible, and trustworthy health guidance.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <motion.div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                        whileHover={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <FeatureIcon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {feature.highlight}
                        </Badge>
                        <h3 className="text-gray-800">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Feature Demo */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="mb-4 text-gray-800">See M&M in Action</h3>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${features[activeFeature].color} flex items-center justify-center`}>
                          {(() => {
                            const IconComponent = features[activeFeature].icon;
                            return <IconComponent className="w-5 h-5 text-white" />;
                          })()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{features[activeFeature].title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {features[activeFeature].highlight}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600">{features[activeFeature].description}</p>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Real-time processing</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Feature Navigation Dots */}
                  <div className="flex space-x-2 mt-6">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === activeFeature ? 'bg-blue-600 w-8' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Demo Visual */}
                <div className="relative">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-500 rounded-full"
                          animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                          }}
                        />
                      ))}
                    </div>
                    
                    {(() => {
                      const IconComponent = features[activeFeature].icon;
                      return <IconComponent className="w-24 h-24 text-blue-600" />;
                    })()}
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-white">Trusted by Healthcare Enthusiasts</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              M&M's advanced AI has helped thousands understand their health better
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <StatIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-blue-100 text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="mb-6 text-gray-800">Ready to Start Your Health Journey?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Experience the future of healthcare guidance with M&M's intelligent symptom analysis
            </p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            >
              <Button 
                onClick={onStartDiagnosis}
                size="lg" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 group"
              >
                Start Diagnosis
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>2-min Analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Background medical image */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1659019479789-4dd5dbdc2cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMGRvY3RvciUyMHN0ZXRob3Njb3BlfGVufDF8fHx8MTc1OTUxMzk3NHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Medical background"
          className="w-96 h-96 object-cover"
        />
      </div>
    </div>
  );
}