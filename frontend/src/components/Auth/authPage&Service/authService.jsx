import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

// Function to register a new user
export const register = async (firstName, lastName, emailAddress, phoneNumber, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      FirstName: firstName,
      LastName: lastName,
      Password: password,
      Email: emailAddress,
      PhoneNumber: phoneNumber,
    });
    return response.data.message;
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to log in a user
export const login = async (emailAddress, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      Email: emailAddress,
      Password: password,
    });
    if (response.data)
      localStorage.setItem('user', JSON.stringify(response.data.Email));
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};