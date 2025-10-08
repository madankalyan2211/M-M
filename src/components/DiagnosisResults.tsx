import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Phone, 
  Hospital, 
  Clock, 
  Brain, 
  FileText, 
  Share, 
  Download, 
  ExternalLink,
  TestTube,
  Clipboard,
  Info,
  Star,
  BookOpen,
  Heart
} from 'lucide-react';

interface DiagnosisResultsProps {
  diagnosis: any;
  onNewDiagnosis: () => void;
}

export function DiagnosisResults({ diagnosis, onNewDiagnosis }: DiagnosisResultsProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'URGENT':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: Phone,
          message: 'URGENT: Call 911 – Immediate Medical Attention Required'
        };
      case 'CONSULT_SOON':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: Hospital,
          message: 'Consult Doctor Soon – Medical Evaluation Recommended'
        };
      default:
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: Clock,
          message: 'Monitor Symptoms – Continue Observation'
        };
    }
  };

  const urgencyConfig = getUrgencyConfig(diagnosis.primary.urgency);
  const UrgencyIcon = urgencyConfig.icon;

  const handleSaveReport = () => {
    // Create a simple text report
    const report = `
M&M Medical Analysis Report
Generated: ${new Date().toLocaleString()}

Primary Diagnosis: ${diagnosis.primary.condition}
Confidence: ${diagnosis.primary.confidence}%
Urgency Level: ${diagnosis.primary.urgency}

Reasoning: ${diagnosis.primary.reasoning}

Recommended Actions:
${diagnosis.primary.actions.map((action: string, i: number) => `${i + 1}. ${action}`).join('\n')}

Alternative Considerations:
${diagnosis.alternatives.map((alt: any) => `- ${alt.condition} (${alt.confidence}%)`).join('\n')}

Processing Time: ${diagnosis.processingTime}s
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mm-medical-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Urgency Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mb-8 p-6 rounded-xl border-2 ${urgencyConfig.bgColor} ${urgencyConfig.borderColor}`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${urgencyConfig.color} rounded-full flex items-center justify-center`}>
              <UrgencyIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-semibold ${urgencyConfig.textColor}`}>
                {urgencyConfig.message}
              </h2>
              <p className="text-gray-600 mt-1">
                {diagnosis.primary.condition} ({diagnosis.primary.confidence}% confidence)
              </p>
            </div>
            {diagnosis.primary.urgency === 'URGENT' && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-red-500"
              >
                <AlertTriangle className="w-8 h-8" />
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Diagnosis Card */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Primary Assessment
                </h3>
                <Badge variant="outline" className="text-blue-600">
                  {diagnosis.processingTime}s analysis
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">
                    {diagnosis.primary.condition}
                  </h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Confidence Level</span>
                    <span className="font-semibold text-blue-600">{diagnosis.primary.confidence}%</span>
                  </div>
                  <Progress value={diagnosis.primary.confidence} className="mb-3" />
                  <p className="text-sm text-gray-700">{diagnosis.primary.reasoning}</p>
                </div>

                {/* AI Reasoning */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    M&M's Analysis
                  </h4>
                  <p className="text-gray-700 text-sm">
                    "Your symptoms match this pattern because: {diagnosis.primary.reasoning}"
                  </p>
                </div>

                {/* Action Steps */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clipboard className="w-4 h-4" />
                    Recommended Actions
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.primary.actions.map((action: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Alternative Diagnoses & Context */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Alternative Diagnoses */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Alternative Considerations
              </h3>
              <div className="space-y-3">
                {diagnosis.alternatives.map((alt: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{alt.condition}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={alt.confidence} className="w-20" />
                      <span className="text-sm font-semibold text-gray-600">{alt.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Medical Context */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                Medical Context
              </h3>
              <div className="text-sm text-gray-700 mb-4">
                Based on {diagnosis.citations.length} medical references including:
              </div>
              <div className="space-y-2">
                {diagnosis.citations.map((citation: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded text-sm">
                    <ExternalLink className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">{citation}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Explainability */}
            <Card className="p-6">
              <Button
                variant="outline"
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full mb-4"
              >
                <Brain className="w-4 h-4 mr-2" />
                {showExplanation ? 'Hide' : 'Show'} AI Explanation
              </Button>
              
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <div className="text-sm text-gray-700">
                    <h4 className="font-semibold mb-2">M&M Confidence Map:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Symptom Pattern Match</span>
                        <Badge variant="secondary">85%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Temporal Correlation</span>
                        <Badge variant="secondary">78%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Literature Alignment</span>
                        <Badge variant="secondary">92%</Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={handleSaveReport} variant="outline" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Save Report (PDF)
          </Button>
          <Button variant="outline" size="lg">
            <Share className="w-4 h-4 mr-2" />
            Send to Doctor
          </Button>
          <Button onClick={onNewDiagnosis} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            New Diagnosis
          </Button>
        </motion.div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <Alert className="max-w-2xl mx-auto">
            <Heart className="h-4 w-4" />
            <AlertDescription>
              Remember, M&M is your digital medical mate — but real doctors are heroes. 
              Always consult healthcare professionals for serious symptoms.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </section>
  );
}