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

module.exports = router;
