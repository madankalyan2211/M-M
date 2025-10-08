import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Database, 
  Zap, 
  Activity, 
  Heart, 
  Dna, 
  Stethoscope,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AIProcessingProps {
  symptomData: any;
  onProcessingComplete: (diagnosis: any) => void;
}

export function AIProcessing({ symptomData, onProcessingComplete }: AIProcessingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  const processingSteps = [
    { 
      id: 1, 
      title: 'ML Model Analyzing', 
      icon: Brain, 
      description: 'Analyzing symptom patterns with neural networks',
      duration: 2000
    },
    { 
      id: 2, 
      title: 'Knowledge Retrieval', 
      icon: Database, 
      description: 'Searching medical databases and literature',
      duration: 1500
    },
    { 
      id: 3, 
      title: 'Diagnosis Generation', 
      icon: Zap, 
      description: 'Generating evidence-based recommendations',
      duration: 1000
    }
  ];

  const floatingIcons = [
    { icon: Heart, delay: 0, color: 'text-red-500' },
    { icon: Dna, delay: 0.5, color: 'text-blue-500' },
    { icon: Brain, delay: 1, color: 'text-purple-500' },
    { icon: Stethoscope, delay: 1.5, color: 'text-green-500' },
    { icon: Activity, delay: 2, color: 'text-yellow-500' }
  ];

  const medicalInsights = [
    "FAST test is crucial for early stroke detection",
    "Time is brain - every minute counts in stroke cases",
    "Sudden onset symptoms require immediate attention",
    "Neurological symptoms can indicate serious conditions",
    "Medical history helps refine diagnostic accuracy"
  ];

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    let insightTimer: NodeJS.Timeout;

    const runProcessing = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        
        // Progress animation for current step
        const stepDuration = processingSteps[i].duration;
        const progressInterval = stepDuration / 100;
        
        let currentProgress = 0;
        progressTimer = setInterval(() => {
          currentProgress += 1;
          setProgress((i * 33.33) + (currentProgress * 0.33));
          
          if (currentProgress >= 100) {
            clearInterval(progressTimer);
          }
        }, progressInterval);

        // Add insights during processing
        if (i < medicalInsights.length) {
          insightTimer = setTimeout(() => {
            setInsights(prev => [...prev, medicalInsights[i]]);
          }, stepDuration / 2);
        }

        await new Promise(resolve => {
          stepTimer = setTimeout(resolve, stepDuration);
        });
      }

      // Processing complete
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Generate mock diagnosis based on symptoms
      const mockDiagnosis = generateMockDiagnosis(symptomData, processingTime);
      setTimeout(() => onProcessingComplete(mockDiagnosis), 500);
    };

    runProcessing();

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
      clearTimeout(insightTimer);
    };
  }, [symptomData, startTime, onProcessingComplete]);

  const generateMockDiagnosis = (data: any, processingTime: string) => {
    // Simple rule-based mock diagnosis
    const hasNumbness = data.symptoms.toLowerCase().includes('numb');
    const hasSuddenOnset = data.symptoms.toLowerCase().includes('sudden');
    const hasHeadache = data.symptoms.toLowerCase().includes('headache');
    const highSeverity = data.severity >= 7;

    let primaryDiagnosis, urgency, confidence;

    if (hasNumbness && hasSuddenOnset && hasHeadache) {
      primaryDiagnosis = {
        condition: "Possible Stroke (Brain Attack)",
        urgency: "URGENT",
        confidence: 85,
        reasoning: "Sudden numbness + severe headache pattern",
        actions: ["Call 911 immediately", "Note symptom start time", "FAST test evaluation"]
      };
    } else if (hasHeadache && highSeverity) {
      primaryDiagnosis = {
        condition: "Severe Headache Disorder",
        urgency: "CONSULT_SOON",
        confidence: 72,
        reasoning: "High severity headache symptoms",
        actions: ["Schedule doctor appointment", "Monitor symptoms", "Rest in dark room"]
      };
    } else {
      primaryDiagnosis = {
        condition: "General Symptom Assessment",
        urgency: "MONITOR",
        confidence: 60,
        reasoning: "Symptoms require further evaluation",
        actions: ["Monitor symptoms", "Rest and hydration", "Consult if worsening"]
      };
    }

    return {
      primary: primaryDiagnosis,
      alternatives: [
        { condition: "Tension Headache", confidence: 45 },
        { condition: "Migraine", confidence: 38 },
        { condition: "Viral Infection", confidence: 25 }
      ],
      processingTime,
      citations: [
        "American Heart Association Stroke Guidelines 2023",
        "National Institute of Health - Neurological Disorders",
        "WHO International Classification of Diseases"
      ]
    };
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-gray-800">M&M is Thinking</h2>
          <p className="text-gray-600">Analyzing your symptoms with clinical precision</p>
        </motion.div>

        {/* Floating Medical Icons Animation */}
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center justify-center">
            {floatingIcons.map(({ icon: Icon, delay, color }, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0.7],
                  rotate: [0, 180, 360],
                  x: [0, Math.cos(index * 2) * 100, 0],
                  y: [0, Math.sin(index * 2) * 100, 0]
                }}
                transition={{ 
                  duration: 4,
                  delay: delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute w-12 h-12 ${color}`}
              >
                <Icon className="w-full h-full" />
              </motion.div>
            ))}
          </div>
          
          {/* Central M&M Logo */}
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
            className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl"
          >
            <Heart className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Processing Steps */}
        <Card className="p-8 mb-8">
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {processingSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50 border-2 border-blue-200' 
                        : isCompleted 
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>

                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 bg-blue-500 rounded-full"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Real-time Insights */}
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Medical Insights
          </h3>
          
          <div className="space-y-2">
            <AnimatePresence>
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {insights.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">Gathering medical insights...</p>
              </div>
            )}
          </div>

          {/* Processing Time Display */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Processing time: {((Date.now() - startTime) / 1000).toFixed(1)}s</span>
          </div>
        </Card>
      </div>
    </section>
  );
}