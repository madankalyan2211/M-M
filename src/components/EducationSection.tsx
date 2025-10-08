import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Users, 
  Award, 
  AlertCircle,
  CheckCircle,
  Brain,
  Heart,
  Activity,
  Zap,
  Target,
  Calendar
} from 'lucide-react';

export function EducationSection() {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const quizQuestions = [
    {
      question: "What does the 'F' in FAST stroke assessment stand for?",
      options: ["Fever", "Face drooping", "Fatigue", "Frequent headaches"],
      correct: 1,
      explanation: "Face drooping is a key early sign of stroke. Ask the person to smile - does one side droop?"
    },
    {
      question: "How quickly should stroke treatment begin?",
      options: ["Within 24 hours", "Within 6 hours", "Within 3 hours", "Within 1 week"],
      correct: 2,
      explanation: "The golden window for stroke treatment is within 3 hours. 'Time is brain' - every minute counts!"
    },
    {
      question: "Which symptom combination suggests highest stroke risk?",
      options: [
        "Mild headache + fatigue",
        "Sudden numbness + speech difficulty",
        "Sore throat + cough",
        "Back pain + nausea"
      ],
      correct: 1,
      explanation: "Sudden neurological symptoms like numbness combined with speech problems are classic stroke signs."
    }
  ];

  const timelineData = [
    { time: "0-3 hours", impact: "90% recovery chance", color: "bg-green-500" },
    { time: "3-6 hours", impact: "70% recovery chance", color: "bg-yellow-500" },
    { time: "6-12 hours", impact: "40% recovery chance", color: "bg-orange-500" },
    { time: "12+ hours", impact: "20% recovery chance", color: "bg-red-500" }
  ];

  const healthArticles = [
    {
      title: "Understanding Stroke Warning Signs",
      category: "Stroke Prevention",
      readTime: "5 min",
      image: "🧠",
      summary: "Learn the FAST method and early warning signs that could save a life."
    },
    {
      title: "Heart Health and Early Detection",
      category: "Cardiovascular",
      readTime: "7 min",
      image: "❤️",
      summary: "Recognize early signs of heart disease and when to seek immediate care."
    },
    {
      title: "Neurological Symptoms Guide",
      category: "Neurology",
      readTime: "6 min",
      image: "🧪",
      summary: "Understanding when neurological symptoms require emergency attention."
    },
    {
      title: "Emergency vs. Urgent Care",
      category: "General Health",
      readTime: "4 min",
      image: "🏥",
      summary: "Know when to call 911, visit urgent care, or schedule with your doctor."
    }
  ];

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === quizQuestions[currentQuiz].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuiz < quizQuestions.length - 1) {
      setCurrentQuiz(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-gray-800 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            Health Insights & Education
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Empower yourself with medical knowledge and learn to recognize important health signals
          </p>
        </motion.div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Network
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-8">
            <Card className="p-8">
              <h3 className="mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                "Why This Matters" Timeline
              </h3>
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800">
                  Stroke Treatment: Early Detection vs Delay Impact
                </h4>
                
                {timelineData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className={`w-4 h-4 ${item.color} rounded-full`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">{item.time}</span>
                        <Badge variant="outline" className="text-sm">
                          {item.impact}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Key Takeaway</h4>
                      <p className="text-blue-700">
                        Early detection of stroke can mean the difference between full recovery and permanent disability. 
                        Every minute matters when brain cells are at risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-8">
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Health Knowledge Quiz
                </h3>
                <Badge variant="outline">
                  Question {currentQuiz + 1} of {quizQuestions.length}
                </Badge>
              </div>

              {currentQuiz < quizQuestions.length ? (
                <div className="space-y-6">
                  <div className="mb-4">
                    <Progress 
                      value={(currentQuiz / quizQuestions.length) * 100} 
                      className="mb-2" 
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>Score: {quizScore}/{quizQuestions.length}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {quizQuestions[currentQuiz].question}
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {quizQuestions[currentQuiz].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={
                            showResult
                              ? index === quizQuestions[currentQuiz].correct
                                ? "default"
                                : index === selectedAnswer
                                ? "destructive"
                                : "outline"
                              : "outline"
                          }
                          className="justify-start p-4 h-auto"
                          onClick={() => !showResult && handleQuizAnswer(index)}
                          disabled={showResult}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center">
                              {showResult && index === quizQuestions[currentQuiz].correct && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <h5 className="font-semibold text-blue-800 mb-2">Explanation</h5>
                        <p className="text-blue-700">{quizQuestions[currentQuiz].explanation}</p>
                        
                        <div className="mt-4 flex justify-end">
                          {currentQuiz < quizQuestions.length - 1 ? (
                            <Button onClick={nextQuestion}>
                              Next Question
                            </Button>
                          ) : (
                            <Button onClick={resetQuiz}>
                              Restart Quiz
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Quiz Complete!</h4>
                  <p className="text-gray-600 mb-4">
                    You scored {quizScore} out of {quizQuestions.length}
                  </p>
                  <Button onClick={resetQuiz}>Take Quiz Again</Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {healthArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{article.image}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">{article.title}</h4>
                        <p className="text-gray-600 text-sm">{article.summary}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-8">
            <Card className="p-8">
              <h3 className="mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Symptom Similarity Explorer
              </h3>
              
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Headache</h4>
                  <p className="text-gray-600">Explore related symptoms and conditions</p>
                </div>

                {/* Network visualization mockup */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { symptom: "Nausea", strength: 85, color: "bg-red-500" },
                    { symptom: "Dizziness", strength: 70, color: "bg-orange-500" },
                    { symptom: "Vision Changes", strength: 60, color: "bg-yellow-500" },
                    { symptom: "Neck Stiffness", strength: 45, color: "bg-blue-500" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="text-center p-4 bg-white rounded-lg shadow-sm border"
                    >
                      <div className={`w-12 h-12 ${item.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <h5 className="font-semibold text-sm mb-1">{item.symptom}</h5>
                      <div className="text-xs text-gray-500 mb-2">{item.strength}% correlation</div>
                      <Progress value={item.strength} className="h-1" />
                    </motion.div>
                  ))}
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Educational Insight</h4>
                  <p className="text-purple-700 text-sm">
                    This network shows how symptoms cluster together in medical conditions. 
                    Understanding these relationships helps in early recognition and appropriate response.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}