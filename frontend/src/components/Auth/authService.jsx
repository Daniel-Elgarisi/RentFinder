import axios from 'axios';

const API_URL = 'http://localhost:5000/auth'; // Change this to your actual API URL

// Function to register a new user
export const register = async (firstName, lastName, emailAddress, phoneNumber, password) => {
  try {
    console.log('hi');
    const response = await axios.post(`${API_URL}/register`, {
      FirstName: firstName,
      LastName: lastName,
      Password: password,
      Email: emailAddress,
      PhoneNumber: phoneNumber,
    });
    console.log(response.data);
    // Assuming the API returns a message on successful registration
    return response.data.message;
  } catch (error) {
    // Handle errors, e.g., duplicate user, validation errors
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
    // Assuming the API returns user data and a token on successful login
    if (response.data.token) {
      // Store user details and token in local storage to keep the user logged in
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};