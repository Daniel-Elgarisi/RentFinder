import React, { useState, useEffect } from "react";
import { MdOutlinePostAdd } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa";
import WatchMyAds from "../WatchMyAds/WatchMyAds";
import PostNewAd from "../PostNewAd/PostNewAd";
import { fetchUserApartments } from "./MyAdsService";
import "./MyAds.css";

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isPostingNewAd, setIsPostingNewAd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const closeDetails = () => setSelectedAd(null);

  useEffect(() => {
    const loadUserApartments = async () => {
      setIsLoading(true);
      try {
        const fetchedAds = await fetchUserApartments();
        setAds(fetchedAds);
        console.log(fetchedAds);
      } catch (error) {
        console.error("Error fetching user's apartments:", error);
      }
      setIsLoading(false);
    };

    loadUserApartments();
  }, []);

  const deleteAd = (id) => {
    const updatedAds = ads.filter((ad) => ad.id !== id);
    setAds(updatedAds);
    setSelectedAd(null);
  };

  const handlePostNewAdClick = () => {
    setIsPostingNewAd(true);
  };

  const handleSelectedAd = (ad) => {
    console.log(ad);
    setSelectedAd(ad);
  };

  if (selectedAd)
    return (
      <WatchMyAds
        selectedAd={selectedAd}
        onClose={closeDetails}
        onDelete={deleteAd}
      />
    );

  if (isPostingNewAd)
    return <PostNewAd onClose={() => setIsPostingNewAd(false)} />;

  return (
    <div className="ads-container">
      <div className="title-with-icon">
        <h3>המודעות שלי</h3>
        <FaHouseUser size={40} color="#cdc2b2" className="icon-shadow" />
      </div>
      <button className="post-new-ad" onClick={handlePostNewAdClick}>
        <MdOutlinePostAdd className="button-icon" />
        פרסום מודעה חדשה
      </button>
      {isLoading ? (
        <div>Loading ads...</div>
      ) : (
        <div className="ads-grid">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="ad-box"
              onClick={() => handleSelectedAd(ad)}
            >
              <img
                src={ad.imageUrl1.replace("/apartments/", "")}
                alt="Apartment"
                className="ad-image"
              />
              <div className="ad-details">
                <p className="ad-price">{ad.price}</p>
                <p className="ad-location">
                  {ad.address}, {ad.city}
                </p>
                <div className="details-row">
                  <div className="details-item">
                    <span>חדרים</span>
                    <span>{ad.rooms}</span>
                  </div>
                  <div className="details-item">
                    <span>קומה</span>
                    <span>{ad.floor}</span>
                  </div>
                  <div className="details-item">
                    <span>מ"ר</span>
                    <span>{ad.square_meter}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAds;
