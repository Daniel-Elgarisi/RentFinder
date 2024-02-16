import React, { useState } from 'react';
import { fakeAds } from './fakeAds'; // Ensure fakeAds is imported correctly
import { MdOutlinePostAdd, MdClose, MdOutlineChair } from "react-icons/md";
import { FaElevator, FaPaintRoller, FaWind } from "react-icons/fa6";
import { RxBlendingMode } from "react-icons/rx";
import { FaAccessibleIcon, FaBorderAll, FaWarehouse } from "react-icons/fa";
import { AiOutlineSafety } from "react-icons/ai";
import { TbSolarPanel2 } from "react-icons/tb";
import { LuParkingSquare } from "react-icons/lu";
import './MyAds.css';

const featureIcons = {
    elevator: <FaElevator />,
    blending: <RxBlendingMode />,
    renovated: <FaPaintRoller />,
    disabledAccess: <FaAccessibleIcon />,
    bars: <FaBorderAll />,
    MMD: <AiOutlineSafety />,
    airConditioner: <FaWind />,
    warehouse: <FaWarehouse />,
    solarHeater: <TbSolarPanel2 />,
    furnished: <MdOutlineChair />,
    parking: <LuParkingSquare />,
};

const featureTranslations = {
    elevator: "מעלית",
    blending: "מיזוג",
    renovated: "משופצת",
    disabledAccess: "גישה לנכים",
    bars: "סורגים",
    MMD: 'ממ"ד',
    airConditioner: "מזגן",
    warehouse: "מחסן",
    solarHeater: "דוד שמש",
    furnished: "מרוהטת",
    parking: "חניה",
};

const MyAds = () => {
    const [selectedAd, setSelectedAd] = useState(null);
    const closeDetails = () => setSelectedAd(null);

    if (selectedAd) {
        return (
            <div className="ad-details-modal">
                <div className="modal-content">
                    <MdClose className="close-modal" onClick={closeDetails} />
                    <div className="modal-inner-content">
                        <img src={selectedAd.imageUrl} alt="Apartment" className="modal-ad-image" />
                        <div className="modal-ad-info">
                            <p className="ad-price">{selectedAd.price}</p>
                            <h3>{selectedAd.address}, {selectedAd.city}</h3>
                            <div className="details-row">
                                <div className="details-item"><span>:מ"ר</span> <span>{selectedAd.Square_meter}</span></div>
                                <div className="details-item"><span>:קומה</span> <span>{selectedAd.floor}</span></div>
                                <div className="details-item"><span>:חדרים</span> <span>{selectedAd.rooms}</span></div>
                            </div>
                            <div className="ad-description">
                                <h3>  :תיאור כללי</h3>
                                <p>{selectedAd.description}</p>
                            </div>
                            <div className='entry_date'>
                                <p>תאריך כניסה: {selectedAd.entryDate}</p>
                            </div>
                            <div className="features-grid">
                                {Object.entries(selectedAd.features).map(([key, value]) => {
                                    const Icon = featureIcons[key];
                                    const iconColor = value === 'yes' ? 'black' : '#bebebe'; // Check if the value is 'כן' for black, otherwise gray
                                    return (
                                        <div key={key} className="feature-item">
                                            {React.cloneElement(Icon, { style: { color: iconColor } })}
                                            <span>{featureTranslations[key]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='lease'>
                                <p>חוזה שכירות: <a href={selectedAd.leaseContract}>הורדה</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ads-container">
            <button className="post-new-ad">
                <MdOutlinePostAdd className="button-icon" />
                פרסום מודעה חדשה
            </button>
            <div className="ads-grid">
                {fakeAds.map((ad) => (
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

export default MyAds;