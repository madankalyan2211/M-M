import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  Type, 
  List, 
  User, 
  Clock,
  Brain,
  Heart,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface SymptomCollectionProps {
  onSymptomSubmit: (symptoms: any) => void;
}

export function SymptomCollection({ onSymptomSubmit }: SymptomCollectionProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [symptoms, setSymptoms] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [severity, setSeverity] = useState([5]);
  const [duration, setDuration] = useState('hours');
  const [ageGroup, setAgeGroup] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [extractedFeatures, setExtractedFeatures] = useState<any>({});

  const bodyParts = [
    { id: 'head', name: 'Head', x: '50%', y: '15%' },
    { id: 'chest', name: 'Chest', x: '50%', y: '35%' },
    { id: 'abdomen', name: 'Abdomen', x: '50%', y: '50%' },
    { id: 'left-arm', name: 'Left Arm', x: '25%', y: '35%' },
    { id: 'right-arm', name: 'Right Arm', x: '75%', y: '35%' },
    { id: 'left-leg', name: 'Left Leg', x: '40%', y: '75%' },
    { id: 'right-leg', name: 'Right Leg', x: '60%', y: '75%' },
  ];

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 
    'Dizziness', 'Chest Pain', 'Shortness of Breath',
    'Abdominal Pain', 'Back Pain', 'Joint Pain', 'Numbness'
  ];

  const severityEmojis = ['😌', '😐', '😕', '😟', '😣'];

  // Real-time feature extraction simulation
  useEffect(() => {
    if (symptoms.length > 10) {
      const features: any = {};
      
      // Simple keyword detection
      if (symptoms.toLowerCase().includes('pain')) features.pain = 1;
      if (symptoms.toLowerCase().includes('headache')) features.headache = 1;
      if (symptoms.toLowerCase().includes('fever')) features.fever = 1;
      if (symptoms.toLowerCase().includes('numb')) features.numbness = 1;
      if (symptoms.toLowerCase().includes('sudden')) features.onset = 'sudden';
      
      setExtractedFeatures(features);
    }
  }, [symptoms]);

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      if (!isListening) {
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setSymptoms(transcript);
        };
      } else {
        recognition.stop();
      }
    }
  };

  const handleBodyPartClick = (partId: string) => {
    setSelectedBodyParts(prev => 
      prev.includes(partId) 
        ? prev.filter(p => p !== partId)
        : [...prev, partId]
    );
  };

  const handleSymptomChip = (symptom: string) => {
    setSymptoms(prev => 
      prev ? `${prev}, ${symptom.toLowerCase()}` : symptom.toLowerCase()
    );
  };

  const handleSubmit = () => {
    const symptomData = {
      symptoms,
      selectedBodyParts,
      severity: severity[0],
      duration,
      ageGroup,
      extractedFeatures
    };
    onSymptomSubmit(symptomData);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-gray-800">Tell M&M About Your Symptoms</h2>
          <p className="text-gray-600">Choose your preferred way to describe how you're feeling</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-fit">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Voice
                  </TabsTrigger>
                  <TabsTrigger value="checklist" className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="visual" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Visual
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    placeholder="Describe your symptoms naturally... e.g., 'I have a severe headache that started suddenly this morning'"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-32"
                  />
                  {symptoms && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-gray-500"
                    >
                      💡 M&M is analyzing your input in real-time...
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="voice" className="space-y-4">
                  <div className="text-center py-8">
                    <Button
                      onClick={handleVoiceInput}
                      size="lg"
                      variant={isListening ? "destructive" : "default"}
                      className="mb-4"
                    >
                      <Mic className="w-6 h-6 mr-2" />
                      {isListening ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                    
                    {isListening && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex justify-center items-center mb-4"
                      >
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                          <Activity className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                    )}
                    
                    <Textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Your speech will appear here..."
                      className="min-h-24"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="checklist" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {commonSymptoms.map((symptom) => (
                      <Button
                        key={symptom}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSymptomChip(symptom)}
                        className="justify-start"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {symptom}
                      </Button>
                    ))}
                  </div>
                  <Textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Selected symptoms will appear here..."
                    className="min-h-24"
                  />
                </TabsContent>

                <TabsContent value="visual" className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg p-4 h-96">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">Click on body parts where you feel symptoms</p>
                    </div>
                    
                    {/* Simple body silhouette */}
                    <div className="relative w-full h-full">
                      <svg viewBox="0 0 200 300" className="w-full h-full">
                        {/* Head */}
                        <circle cx="100" cy="40" r="25" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                        {/* Body */}
                        <rect x="80" y="65" width="40" height="80" rx="10" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                        {/* Arms */}
                        <rect x="50" y="75" width="25" height="60" rx="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                        <rect x="125" y="75" width="25" height="60" rx="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                        {/* Legs */}
                        <rect x="85" y="145" width="15" height="80" rx="7" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                        <rect x="100" y="145" width="15" height="80" rx="7" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                      </svg>
                      
                      {/* Clickable body parts */}
                      {bodyParts.map((part) => (
                        <motion.button
                          key={part.id}
                          className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${
                            selectedBodyParts.includes(part.id)
                              ? 'bg-red-500 border-red-600 text-white'
                              : 'bg-white border-gray-300 hover:border-blue-500'
                          }`}
                          style={{ left: part.x, top: part.y }}
                          onClick={() => handleBodyPartClick(part.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {selectedBodyParts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedBodyParts.map((partId) => {
                        const part = bodyParts.find(p => p.id === partId);
                        return (
                          <Badge key={partId} variant="destructive">
                            {part?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Severity and Duration */}
              <div className="mt-6 space-y-6">
                <div>
                  <label className="block mb-2">Severity Level</label>
                  <div className="space-y-2">
                    <Slider
                      value={severity}
                      onValueChange={setSeverity}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Mild {severityEmojis[0]}</span>
                      <span className="text-lg">{severityEmojis[Math.floor(severity[0] / 2.5)] || '😣'}</span>
                      <span className="text-sm text-gray-500">Severe {severityEmojis[4]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Duration</label>
                  <div className="flex gap-2">
                    {['hours', 'days', 'weeks'].map((dur) => (
                      <Button
                        key={dur}
                        variant={duration === dur ? "default" : "outline"}
                        onClick={() => setDuration(dur)}
                        className="flex-1"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {dur}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Age Group</label>
                  <div className="flex gap-2">
                    {['Child', 'Adult', 'Elderly'].map((age) => (
                      <Button
                        key={age}
                        variant={ageGroup === age ? "default" : "outline"}
                        onClick={() => setAgeGroup(age)}
                        className="flex-1"
                      >
                        {age}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Real-time Preview */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 sticky top-8">
              <h3 className="mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                M&M's Real-time Analysis
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="mb-2">Detected Features</h4>
                  <div className="space-y-2">
                    {Object.entries(extractedFeatures).map(([key, value]) => (
                      <Badge key={key} variant="secondary">
                        {key}: {value}
                      </Badge>
                    ))}
                    {Object.keys(extractedFeatures).length === 0 && (
                      <p className="text-gray-500 text-sm">Start describing symptoms to see analysis...</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="mb-2">Input Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Severity:</strong> {severity[0]}/10</p>
                    <p><strong>Duration:</strong> {duration}</p>
                    <p><strong>Age Group:</strong> {ageGroup || 'Not specified'}</p>
                    <p><strong>Body Parts:</strong> {selectedBodyParts.join(', ') || 'None selected'}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit} 
                  className="w-full" 
                  size="lg"
                  disabled={!symptoms.trim()}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze Symptoms
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}