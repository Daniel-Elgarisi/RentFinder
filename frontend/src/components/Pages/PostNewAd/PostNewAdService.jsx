import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/apartments';

export const postNewApartment = async (apartmentDetails) => {
  console.log(apartmentDetails);
  try {
    const detailResponse = await axios.post(`${API_BASE_URL}/insert-apartment-ad`, {
      address: apartmentDetails.address,
      city: apartmentDetails.city,
      rooms: apartmentDetails.rooms,
      floor: apartmentDetails.floor,
      price: apartmentDetails.price,
      square_meter: apartmentDetails.squareMeter,
      description: apartmentDetails.description,
      entryDate: apartmentDetails.entryDate,
      elevator: apartmentDetails.elevator ? 1 : 0,
      blending: apartmentDetails.blending ? 1 : 0,
      renovated: apartmentDetails.renovated ? 1 : 0,
      disabledAccess: apartmentDetails.disabledAccess ? 1 : 0,
      bars: apartmentDetails.bars ? 1 : 0,
      MMD: apartmentDetails.MMD ? 1 : 0,
      airConditioner: apartmentDetails.airConditioner ? 1 : 0,
      warehouse: apartmentDetails.warehouse ? 1 : 0,
      solarHeater: apartmentDetails.solarHeater ? 1 : 0,
      furnished: apartmentDetails.furnished ? 1 : 0,
      parking: apartmentDetails.parking ? 1 : 0,
    });

    const apartmentId = detailResponse.data.adId;

    const formDataImages = new FormData();
    apartmentDetails.images.forEach(image => {
      formDataImages.append('images', image);
    });

    formDataImages.append('id', apartmentId);
    await axios.post(`${API_BASE_URL}/add-apartment-photos`, formDataImages, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const formDataPDF = new FormData();
    formDataPDF.append('file', apartmentDetails.leasePdf);
    formDataPDF.append('id', apartmentId);
    const pdfResponse = await axios.post(`${API_BASE_URL}/save-pdf`, formDataPDF, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return pdfResponse.data;
  } catch (error) {
    console.error('Error adding apartment:', error.response ? error.response.data : error.message);
    throw error;
  }
};
