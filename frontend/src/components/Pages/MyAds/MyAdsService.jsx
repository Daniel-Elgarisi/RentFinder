import axios from "axios";

const API_BASE_URL = "http://localhost:5000/apartments";

export const fetchUserApartments = async () => {
  const userEmail = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get-allAdsForOwner/${userEmail}`
    );
    const transformedData = response.data.map((apartment) => ({
      ...apartment,
      imageUrl1: apartment.imageUrl1
        ? `${API_BASE_URL}/${apartment.imageUrl1}`
        : null,
      imageUrl2: apartment.imageUrl2
        ? `${API_BASE_URL}/${apartment.imageUrl2}`
        : null,
      imageUrl3: apartment.imageUrl3
        ? `${API_BASE_URL}/${apartment.imageUrl3}`
        : null,
      elevator: !!apartment.elevator,
      blending: !!apartment.blending,
      renovated: !!apartment.renovated,
      disabledAccess: !!apartment.disabledAccess,
      bars: !!apartment.bars,
      MMD: !!apartment.MD,
      airConditioner: !!apartment.airConditioner,
      warehouse: !!apartment.warehouse,
      solarHeater: !!apartment.solarHeater,
      furnished: !!apartment.furnished,
      parking: !!apartment.parking,
    }));
    return transformedData;
  } catch (error) {
    console.error("Failed to fetch apartments:", error);
    throw error;
  }
};
