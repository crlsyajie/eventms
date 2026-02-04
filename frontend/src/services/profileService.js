import api from '../api/axios';

export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch profile' };
  }
};

export const updateProfile = async (profileData) => {
  try {
    // Add current username to help identify the user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const dataWithCurrentUser = {
      ...profileData,
      current_username: user.username
    };
    
    const response = await api.put('/users/profile/', dataWithCurrentUser);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update profile' };
  }
};

export default {
  getProfile,
  updateProfile,
};
