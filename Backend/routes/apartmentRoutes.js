// routes/apartmentRoutes.js
const express = require("express");
const router = express.Router();
const { upload, uploadPhotos } = require("../utils/multerConfig");
const {
  getAllApartments,
  insertApartmentAd,
  savePDF,
  addPhotoToApartment,
  getSingleApartmentInformation,
  incrementApartmentViews,
  getAllAdsForOwner,
  deleteApartmentAd,
  sendRequestOfInterest,
  deleteRequestOfInterest,
  getUnapprovedRequests,
  getRequestOfInterest,
} = require("../controllers/apartmentController");

router.get("/display-all-apartments", getAllApartments);
router.post("/insert-apartment-ad/:Email", insertApartmentAd);
router.post("/save-pdf", upload.single("file"), savePDF);
router.post("/add-apartment-photos", uploadPhotos, addPhotoToApartment);
router.get(
  "/get-singleApartmentInformation/:ad_id",
  incrementApartmentViews,
  getSingleApartmentInformation
);
router.get("/get-allAdsForOwner/:Email", getAllAdsForOwner);
router.delete("/delete-apartmentAd/:ad_id", deleteApartmentAd);
router.post("/send-requestOfInterest/:ad_id", sendRequestOfInterest);
router.delete("/delete-requestOfInterest/:id", deleteRequestOfInterest);
router.get("/get-unapprovedRequests/:Email", getUnapprovedRequests);
router.get("/get-requestOfInterest/:Email", getRequestOfInterest);

module.exports = router;
