import React from 'react';
import { MdClose, MdOutlineChair } from "react-icons/md";
import { FaElevator, FaPaintRoller, FaWind } from "react-icons/fa6";
import { RxBlendingMode } from "react-icons/rx";
import { FaAccessibleIcon, FaBorderAll, FaWarehouse } from "react-icons/fa";
import { AiOutlineSafety } from "react-icons/ai";
import { TbSolarPanel2 } from "react-icons/tb";
import { LuParkingSquare } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";
import './WatchMyAds.css';

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

const WatchMyAds = ({ selectedAd, onClose, onDelete }) => {
    return (
        <div className="ad-details-modal">
            <div className="modal-content">
                <MdClose className="close-modal" onClick={onClose} />
                <div className="modal-inner-content">
                    <p>מספר צפיות: {selectedAd.viewsAmount}</p>
                    <img src={selectedAd.imageUrl} alt="Apartment" className="modal-ad-image" />
                    <div className="modal-ad-info">
                        <p className="ad-price">{selectedAd.price}</p>
                        <h3>{selectedAd.address}, {selectedAd.city}</h3>
                        <div className="details-row">
                            <div className="details-item"><span>מ"ר:</span> <span>{selectedAd.Square_meter}</span></div>
                            <div className="details-item"><span>קומה:</span> <span>{selectedAd.floor}</span></div>
                            <div className="details-item"><span>חדרים:</span> <span>{selectedAd.rooms}</span></div>
                        </div>
                        <div className="ad-description">
                            <h3>:תיאור כללי</h3>
                            <p>{selectedAd.description}</p>
                        </div>
                        <div className='entry_date'>
                            <p>תאריך כניסה: {selectedAd.entryDate}</p>
                        </div>
                        <div className="features-grid">
                            {Object.entries(selectedAd.features).map(([key, value]) => {
                                const Icon = featureIcons[key];
                                const iconColor = value === 'yes' ? 'white' : '#99989869';
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
                        <button className="delete-ad" onClick={() => onDelete(selectedAd.id)}>
                            מחיקת מודעה
                            <RiDeleteBin5Line className="button-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchMyAds;