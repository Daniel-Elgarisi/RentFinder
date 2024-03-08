import axios from "axios";

const API_BASE_URL = "http://localhost:5000/users";

export const fetchUserDetails = async (userEmail) => {
  try {
    const encodedEmail = encodeURIComponent(userEmail);
    const response = await axios.get(
      `${API_BASE_URL}/get-PhoneNumber/${encodedEmail}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDetails = async (phoneNumber, password) => {
  try {
    const userEmail = JSON.parse(localStorage.getItem("user"));
    const response = await axios.post(`${API_BASE_URL}/update-details`, {
      email: userEmail, // Only needed if the backend uses this to identify the user
      newPhoneNumber: phoneNumber,
      newPassword: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
