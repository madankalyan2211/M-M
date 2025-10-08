import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Heart, 
  User, 
  Scale, 
  Ruler, 
  Droplets, 
  Calendar, 
  Activity, 
  Save, 
  SkipForward, 
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

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

interface PersonalDetailsDialogProps {
  isOpen: boolean;
  onSave: (healthDetails: HealthDetails) => void;
  onSkip: () => void;
  userName: string;
}

export function PersonalDetailsDialog({ isOpen, onSave, onSkip, userName }: PersonalDetailsDialogProps) {
  const [formData, setFormData] = useState<HealthDetails>({
    height: '',
    weight: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: '',
    allergies: '',
    chronicConditions: '',
    emergencyContact: '',
    preferredUnits: 'metric'
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleInputChange = (field: keyof HealthDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    // Simulate saving process
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave(formData);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.height.trim() !== '' && formData.weight.trim() !== '' && formData.bloodGroup.trim() !== '';
      case 2:
        return formData.dateOfBirth.trim() !== '' && formData.gender.trim() !== '';
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const getValidationMessage = () => {
    switch (currentStep) {
      case 1:
        if (!formData.height) return "Please enter your height";
        if (!formData.weight) return "Please enter your weight";
        if (!formData.bloodGroup) return "Please select your blood group";
        return "";
      case 2:
        if (!formData.dateOfBirth) return "Please enter your date of birth";
        if (!formData.gender) return "Please select your gender";
        return "";
      default:
        return "";
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic Health Info";
      case 2: return "Personal Details";
      case 3: return "Medical History";
      default: return "Health Profile";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Help us understand your physical profile for better health analysis";
      case 2: return "Personal information for accurate health recommendations";
      case 3: return "Additional medical information (optional but recommended)";
      default: return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl h-[85vh] max-h-[600px] flex flex-col"
      >
        <Card className="bg-white shadow-2xl border-0 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-gray-800">Welcome, {userName.split(' ')[0]}!</h2>
                  <p className="text-gray-600">Let's personalize your M&M experience</p>
                </div>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{getStepTitle()}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-500">{getStepDescription()}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Health Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Units Toggle */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleInputChange('preferredUnits', 'metric')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          formData.preferredUnits === 'metric' 
                            ? 'bg-white shadow-sm text-blue-600' 
                            : 'text-gray-600'
                        }`}
                      >
                        Metric (cm, kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('preferredUnits', 'imperial')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          formData.preferredUnits === 'imperial' 
                            ? 'bg-white shadow-sm text-blue-600' 
                            : 'text-gray-600'
                        }`}
                      >
                        Imperial (ft, lbs)
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Height */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-blue-600" />
                        Height
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder={formData.preferredUnits === 'metric' ? 'cm' : 'feet'}
                          value={formData.height}
                          onChange={(e) => handleInputChange('height', e.target.value)}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          {formData.preferredUnits === 'metric' ? 'cm' : 'ft'}
                        </span>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-green-600" />
                        Weight
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder={formData.preferredUnits === 'metric' ? 'kg' : 'lbs'}
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          {formData.preferredUnits === 'metric' ? 'kg' : 'lbs'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-red-600" />
                      Blood Group
                    </Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            <div className="flex items-center space-x-2">
                              <Droplets className="w-4 h-4 text-red-500" />
                              <span>{group}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        Date of Birth
                      </Label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        Gender
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genders.map((gender) => (
                            <SelectItem key={gender} value={gender.toLowerCase()}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      Emergency Contact
                    </Label>
                    <Input
                      type="text"
                      placeholder="Name and phone number"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      This information helps in emergency situations
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Medical History */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Allergies */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      Known Allergies
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g., Peanuts, Shellfish, Penicillin (optional)"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                    />
                  </div>

                  {/* Chronic Conditions */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      Chronic Conditions
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g., Diabetes, Hypertension, Asthma (optional)"
                      value={formData.chronicConditions}
                      onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                    />
                  </div>

                  {/* Privacy Notice */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">Your Privacy Matters</h4>
                        <p className="text-sm text-blue-700">
                          All health information is encrypted and stored locally. M&M uses this data only 
                          to provide personalized health insights and will never share it with third parties.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            
            {/* Validation Message */}
            {!isStepValid() && getValidationMessage() && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-600 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{getValidationMessage()}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    size="lg"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip for now
                </Button>
              </div>

              <div className="flex space-x-3">
                  {currentStep < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      size="lg"
                      className={`px-8 py-3 ${!isStepValid() 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      } transition-all duration-200`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Next Step</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Complete Setup</span>
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}