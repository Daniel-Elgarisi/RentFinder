import React, { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { FaPhone, FaLock } from "react-icons/fa";
import { fetchUserDetails, updateDetails } from "./UserDetailsService";
import './UpdateUserDetails.css';

function UpdateUserDetails() {
    const [emailAddress, setEmailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const userEmail = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await fetchUserDetails(userEmail);
                setEmailAddress(userEmail);
                setPhoneNumber(response.PhoneNumber);
            } catch (error) {
                console.error("Error fetching user details:", error);
                alert("Failed to fetch user details.");
            }
        };

        getUserDetails();
    }, [userEmail]);

    const validatePhoneNumber = (phoneNumber) => {
        const isValidPhoneNumber = /^\d+$/.test(phoneNumber);
        if (!isValidPhoneNumber)
            return false;
        return true;
    };

    const validatePassword = (password) => {
        if (password.length === 0)
            return true;
        else {
            const hasUpperCase = /[A-Z]/.test(password);
            const hasDigit = /\d/.test(password);
            const isValidLength = password.length >= 8;

            if (!isValidLength || !hasUpperCase || !hasDigit)
                return false;
            return true;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isPhoneOk = validatePhoneNumber(phoneNumber);
        const isPasswordOk = validatePassword(password);
        if (isPhoneOk && isPasswordOk){
            updateDetails(emailAddress, phoneNumber, password);
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(emailAddress));
        }
        else if (!isPhoneOk && isPasswordOk) {
            setPhoneNumber("");
            alert("# מספר טלפון חייב להיות מורכב מספרות בלבד.");
        }
        else if (isPhoneOk && !isPasswordOk) {
            setPassword("");
            alert("# הסיסמה חייבת להיות באורך של לפחות 8 תווים, לכלול לפחות ספרה אחת ואות גדולה אחת.");
        }
        else {
            alert("# מספר טלפון חייב להיות מורכב מספרות בלבד.\n# הסיסמה חייבת להיות באורך של לפחות 8 תווים, לכלול לפחות ספרה אחת ואות גדולה אחת.");
            setPhoneNumber("");
            setPassword("");
        }
    };

    return (
        <div className="update-details-container">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>עדכון פרטי משתמש</h1>
                    <div className="input-box">
                        <input type="email" placeholder="אימייל" required value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                        <MdEmail className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="tel" placeholder="טלפון" required value={phoneNumber} minLength={9} maxLength={10} onChange={(e) => setPhoneNumber(e.target.value)} />
                        <FaPhone className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="סיסמא" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <FaLock className="icon" />
                    </div>
                    <button type="submit">עדכון</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUserDetails;
