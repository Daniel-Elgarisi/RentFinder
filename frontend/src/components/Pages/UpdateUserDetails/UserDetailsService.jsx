import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/users';

export const fetchUserDetails = async (userEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-PhoneNumber/${userEmail}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateDetails = async (userEmail, newEmail, phoneNumber, password) => {
    try {
        console.log(userEmail, phoneNumber, password);
        const response = await axios.post(`${API_BASE_URL}/update-details`, {
            email: userEmail,
            newEmail: newEmail,
            newPhoneNumber: phoneNumber,
            newPassword: password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};