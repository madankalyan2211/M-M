import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Heart, 
  Activity, 
  Clock, 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  LogOut,
  Download,
  FileText,
  Stethoscope,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

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

interface ProfileSectionProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

export function ProfileSection({ user, onUpdateUser, onLogout }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const stats = [
    { 
      label: "Symptoms Analyzed", 
      value: "12", 
      icon: Stethoscope, 
      change: "+3 this month",
      color: "text-blue-600"
    },
    { 
      label: "Health Insights", 
      value: "8", 
      icon: TrendingUp, 
      change: "+2 this week",
      color: "text-green-600"
    },
    { 
      label: "Days Active", 
      value: "45", 
      icon: Activity, 
      change: "Since joining",
      color: "text-purple-600"
    },
    { 
      label: "Education Completed", 
      value: "6", 
      icon: CheckCircle, 
      change: "Modules finished",
      color: "text-orange-600"
    }
  ];

  const recentActivity = [
    {
      type: "symptom",
      title: "Symptom Analysis",
      description: "Analyzed headache symptoms",
      time: "2 hours ago",
      icon: Stethoscope
    },
    {
      type: "education",
      title: "Health Education",
      description: "Completed 'Understanding Blood Pressure'",
      time: "1 day ago",
      icon: FileText
    },
    {
      type: "checkup",
      title: "Health Check",
      description: "Monthly health assessment",
      time: "3 days ago",
      icon: Heart
    }
  ];

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setEditedUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-800 mb-2">Your Health Profile</h1>
              <p className="text-gray-600">Manage your account and health preferences</p>
            </div>
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Last login: {formatDate(user.loginTime)}
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </Avatar>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-gray-800 mb-1">{user.name}</h3>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                <div className="flex justify-center space-x-2">
                  <Button
                    variant={isEditing ? "destructive" : "outline"}
                    size="sm"
                    onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                  >
                    {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  
                  {isEditing && (
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h4 className="text-gray-800 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-3" />
                    Export Health Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-3" />
                    View Health Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Details & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h4 className="text-gray-800 mb-6">Your Health Journey</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const StatIcon = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="text-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <StatIcon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                        <div className="text-xs text-gray-500">{stat.change}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h4 className="text-gray-800 mb-6">Personal Information</h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.name}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1 p-2 bg-gray-50 rounded">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{user.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Email Address</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1 p-2 bg-gray-50 rounded">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Phone Number</Label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editedUser.phone || ''}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1 p-2 bg-gray-50 rounded">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedUser.dateOfBirth || ''}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1 p-2 bg-gray-50 rounded">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{user.dateOfBirth || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Location</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.location || ''}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Enter your location"
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 mt-1 p-2 bg-gray-50 rounded">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{user.location || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h4 className="text-gray-800 mb-6">Preferences & Settings</h4>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-600">Receive health reminders and updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={editedUser.preferences.notifications}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Settings className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <Label>Voice Assistance</Label>
                        <p className="text-sm text-gray-600">Enable voice input and output</p>
                      </div>
                    </div>
                    <Switch
                      checked={editedUser.preferences.voiceEnabled}
                      onCheckedChange={(checked) => handlePreferenceChange('voiceEnabled', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <Label>Language</Label>
                        <p className="text-sm text-gray-600">Choose your preferred language</p>
                      </div>
                    </div>
                    <select
                      value={editedUser.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h4 className="text-gray-800 mb-6">Recent Activity</h4>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const ActivityIcon = activity.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <ActivityIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-800">{activity.title}</h5>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}