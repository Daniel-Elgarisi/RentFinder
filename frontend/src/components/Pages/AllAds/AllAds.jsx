import React, { useState, useEffect } from 'react';
import { fakeAds } from '../MyAds/fakeAds';
import { MdOutlineHomeWork } from "react-icons/md";
import './AllAds.css';

const AllAds = () => {
    const [ads, setAds] = useState(fakeAds);
    const [selectedAd, setSelectedAd] = useState(null);
    const closeDetails = () => setSelectedAd(null);

    useEffect(() => {
        const storedAds = localStorage.getItem('ads');
        setAds(storedAds ? JSON.parse(storedAds) : fakeAds);
    }, []);

    useEffect(() => {
        localStorage.setItem('ads', JSON.stringify(ads));
    }, [ads]);

    return (
        <div className="ads-container">
            <div className="title-with-icon">
                <h3>מודעות נדל"ן להשכרה</h3>
                <MdOutlineHomeWork size={60} color='#cdc2b2' className='icon-shadow'/>
            </div>
            <div className="ads-grid">
                {ads.map((ad) => (
                    <div key={ad.id} className="ad-box" onClick={() => setSelectedAd(ad)}>
                        <img src={ad.imageUrl} alt="Apartment" className="ad-image" />
                        <div className="ad-details">
                            <p className="ad-price">{ad.price}</p>
                            <p className="ad-location">{ad.address}, {ad.city}</p>
                            <div className="details-row">
                                <div className="details-item"><span>חדרים</span><span>{ad.rooms}</span></div>
                                <div className="details-item"><span>קומה</span><span>{ad.floor}</span></div>
                                <div className="details-item"><span>מ"ר</span><span>{ad.Square_meter}</span></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllAds;