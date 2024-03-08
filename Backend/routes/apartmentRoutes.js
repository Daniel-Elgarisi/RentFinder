// routes/apartmentRoutes.js
const express = require("express");
const router = express.Router();
const { upload, uploadPhotos } = require("../utils/multerConfig");
const {
  getAllAPartments,
  insertApartmentAd,
  savePDF,
  addPhotoToApartment,
  getSingleApartmentInformation,
  incrementApartmentViews,
} = require("../controllers/apartmentController");

router.get("/display-all-apartments", getAllAPartments);
router.post("/insert-apartment-ad", insertApartmentAd);
router.post("/save-pdf", upload.single("file"), savePDF);
router.post("/add-apartment-photos", uploadPhotos, addPhotoToApartment);
router.get(
  "/get-singleApartmentInformation/:ad_id",
  incrementApartmentViews,
  getSingleApartmentInformation
);
// router.post("/update-apartmentViewsAmount", );

module.exports = router;
