import React, { useState, useEffect } from 'react';
import NavBar from '../../Bars/NavBar';
import CustomTitle from '../../CustomTitle/CustomTitle';
import UpdateUserDetails from '../UpdateUserDetails/UpdateUserDetails';
import MyAds from '../MyAds/MyAds';
import AllAds from '../AllAds/AllAds';
import './HomePage.css';

function HomePage() {
    const [currentView, setCurrentView] = useState('homepage');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleAction = (action) => {
        setCurrentView(action);
    };

    if (isLoading)
        return <div className="loading-container"><h1 className='Loading-title'>Loading...</h1></div>;

    return (
        <div className='home-container'>
            <NavBar onAction={handleAction} />
            {currentView === 'homepage' && <CustomTitle />}
            {currentView === 'UpdateUserDetails' && <UpdateUserDetails />}
            {currentView === 'MyAds' && <MyAds />}
            {currentView === 'AllAds' && <AllAds />}
        </div>
    );
}

export default HomePage;