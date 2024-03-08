import React, { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { MdOutlineChair } from "react-icons/md";
import { FaElevator, FaPaintRoller, FaWind } from "react-icons/fa6";
import { RxBlendingMode } from "react-icons/rx";
import { FaAccessibleIcon, FaBorderAll, FaWarehouse } from "react-icons/fa";
import { AiOutlineSafety } from "react-icons/ai";
import { TbSolarPanel2 } from "react-icons/tb";
import { LuParkingSquare } from "react-icons/lu";
import { postNewApartment } from "./PostNewAdService";
import { LuUpload } from "react-icons/lu";
import { Hebrew } from 'flatpickr/dist/l10n/he.js';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './PostNewAd.css';

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

const PostNewAd = ({ onClose }) => {
    const [images, setImages] = useState([]);
    const [address, setAddress] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [city, setCity] = useState('');
    const [rooms, setRooms] = useState('');
    const [floor, setFloor] = useState('');
    const [squareMeter, setSquareMeter] = useState('');
    const [description, setDescription] = useState('');
    const [entryDate, setEntryDate] = useState('');
    const [leasePdf, setLeasePdf] = useState(null);
    const [price, setPrice] = useState('');
    const [features, setFeatures] = useState(Object.keys(featureIcons).reduce((acc, key) => ({ ...acc, [key]: false }), {}));

    const toggleFeature = (feature) => {
        setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 3) {
            alert("You can only select up to 3 images.");
            e.target.value = "";
        } else {
            setImages([...e.target.files]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(features);

        const apartmentDetails = {
            address,
            houseNumber,
            city,
            rooms,
            floor,
            squareMeter,
            description,
            entryDate,
            leasePdf,
            price,
            elevator: features.elevator,
            blending: features.blending,
            renovated: features.renovated,
            disabledAccess: features.disabledAccess,
            bars: features.bars,
            MMD: features.MMD,
            airConditioner: features.airConditioner,
            warehouse: features.warehouse,
            solarHeater: features.solarHeater,
            furnished: features.furnished,
            parking: features.parking,
            images,
        };

        try {
            await postNewApartment(apartmentDetails);
            alert('Apartment ad posted successfully!');
            onClose(); // Close form/modal on success
        } catch (error) {
            console.error('Failed to post the apartment ad:', error);
            alert('Failed to post the apartment ad. Please try again.');
        }

        onClose();
    };

    return (
        <div className="post-new-ad-modal">
            <div className="modal-content">
                <RiCloseLine className="close-modal" onClick={onClose} />
                <form className="post-new-ad-form" onSubmit={handleSubmit}>
                    <h2>פרסום מודעה חדשה</h2>
                    <div className="form-row">
                        <div className="form-column">
                            <input type="text" placeholder="מחיר" value={price} onChange={(e) => setPrice(e.target.value)} required />
                            <input type="text" placeholder="עיר" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div className="form-column">
                            <div className="address-inputs">
                                <input type="text" className="street-input" placeholder="רחוב" value={address} onChange={(e) => setAddress(e.target.value)} required />
                                <input type="text" className="house-number-input" placeholder="בית" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} required />
                            </div>
                            <input type="number" placeholder="מספר חדרים" value={rooms} onChange={(e) => setRooms(e.target.value)} required />
                        </div>
                        <div className="form-column">
                            <input type="number" placeholder="קומה" value={floor} onChange={(e) => setFloor(e.target.value)} required />
                            <input type="number" placeholder='מ"ר' value={squareMeter} onChange={(e) => setSquareMeter(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-column">
                            <label>תאריך כניסה</label>
                            <Flatpickr
                                value={entryDate}
                                placeholder='לחץ לבחירת תאריך'
                                onChange={date => {
                                    setEntryDate(date);
                                }}
                                options={{
                                    minDate: "today",
                                    dateFormat: "d/m/Y",
                                    locale: Hebrew,
                                }}
                            />
                        </div>
                        <div className="form-column">
                            <label>תמונות</label>
                            <div className="file-upload-container">
                                <LuUpload onClick={() => document.getElementById('image-upload').click()} />
                                <input id="image-upload" type="file" multiple onChange={handleImageChange} required style={{ display: 'none' }} />
                                <span>{images.length ? `הועלו ${images.length} תמונות` : 'לא הועלו תמונות'}</span>
                            </div>
                        </div>
                        <div className="form-column">
                            <label>חוזה שכירות</label>
                            <div className="file-upload-container">
                                <LuUpload onClick={() => document.getElementById('lease-upload').click()} />
                                <input id="lease-upload" type="file" accept="application/pdf" onChange={(e) => setLeasePdf(e.target.files[0])} required style={{ display: 'none' }} />
                                <span>{leasePdf ? `${leasePdf.name}` : 'לא הועלה חוזה'}</span>
                            </div>
                        </div>
                    </div>
                    <textarea placeholder="תיאור כללי" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <div className="features-section">
                        {Object.entries(featureIcons).map(([feature, Icon]) => (
                            <div key={feature} className={`feature-item ${features[feature] ? 'active' : ''}`} onClick={() => toggleFeature(feature)}>
                                {React.cloneElement(Icon, { className: features[feature] ? 'feature-icon-active' : 'feature-icon' })}
                                <span>{featureTranslations[feature]}</span>
                            </div>
                        ))}
                    </div>
                    <button type="submit">פרסם מודעה</button>
                </form>
            </div>
        </div>
    );
};

export default PostNewAd;
