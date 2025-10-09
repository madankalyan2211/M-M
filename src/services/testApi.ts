import { api } from './api';

export const testProfileUpdate = async () => {
  try {
    // Test data
    const testData = {
      healthDetails: {
        height: "170",
        weight: "65",
        bloodGroup: "A+",
        dateOfBirth: "1990-01-01",
        gender: "male",
        allergies: "None",
        chronicConditions: "None",
        emergencyContact: "Emergency Contact Info",
        preferredUnits: "metric"
      }
    };
    
    console.log('Testing profile update with data:', testData);
    
    // Try to update profile
    const response = await api.updateProfile(testData);
    
    console.log('Profile update response:', response);
    
    return response;
  } catch (error) {
    console.error('Profile update test error:', error);
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};