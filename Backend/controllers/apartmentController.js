const db = require("../DB");
const path = require("path");

const insertApartmentAd = (req, res) => {
  const Email = req.params.Email;
  const {
    address,
    city,
    rooms,
    floor,
    price,
    square_meter,
    description,
    entryDate,
    elevator,
    blending,
    renovated,
    disabledAccess,
    bars,
    MMD,
    airConditioner,
    warehouse,
    solarHeater,
    furnished,
    parking,
    viewsAmount,
  } = req.body;

  const featuresToInt = (feature) => (feature ? 1 : 0);

  const sql = `INSERT INTO MyRentalAds (
    address, city, rooms, floor, price, square_meter, description, 
    entryDate, elevator, blending, renovated, disabledAccess, bars, MMD, airConditioner, warehouse, 
    solarHeater, furnished, parking, IsRented, viewsAmount, user_email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`;

  const values = [
    address,
    city,
    rooms,
    floor,
    price,
    square_meter,
    description,
    entryDate,
    featuresToInt(elevator),
    featuresToInt(blending),
    featuresToInt(renovated),
    featuresToInt(disabledAccess),
    featuresToInt(bars),
    featuresToInt(MMD),
    featuresToInt(airConditioner),
    featuresToInt(warehouse),
    featuresToInt(solarHeater),
    featuresToInt(furnished),
    featuresToInt(parking),
    // viewsAmount,
    Email,
  ];

  console.log(viewsAmount);
  console.log("values", values);

  db.run(sql, values, function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Failed to insert apartment ad.");
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.status(201).send({
      message: `Apartment ad inserted successfully with ID ${this.lastID}`,
      adId: this.lastID,
    });
  });
};

const savePDF = (req, res) => {
  if (!req.file || !req.body.id) {
    return res
      .status(400)
      .send("No file uploaded or apartment ID not provided.");
  }

  const leaseContractPath = req.file.path;
  const apartmentId = req.body.id;

  const sql = "UPDATE MyRentalAds SET leaseContract = ? WHERE id = ?";
  db.run(sql, [leaseContractPath, apartmentId], function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Failed to save lease contract.");
    }

    if (this.changes > 0) {
      res.send({
        message: "Lease contract uploaded and saved successfully",
        filename: req.file.filename,
        path: leaseContractPath,
      });
    } else {
      res.status(404).send("No apartment found with the provided ID.");
    }
  });
};

const addPhotoToApartment = (req, res) => {
  const { id } = req.body;
  console.log("id", id);
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("At least one photo is required.");
  }

  const photoUrls = req.files.map(
    (file) => `/Photos/${path.basename(file.path)}`
  );

  let updateSQL = `UPDATE MyRentalAds SET `;
  const updateParams = [];

  photoUrls.forEach((url, index) => {
    updateSQL += `imageUrl${index + 1} = ?, `;
    updateParams.push(url);
  });

  updateSQL = updateSQL.slice(0, -2);
  updateSQL += ` WHERE id = ?`;
  updateParams.push(id);

  db.run(updateSQL, updateParams, function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Failed to update apartment ad with photos.");
    }
    console.log(`Apartment ad ${id} updated with photos.`);
    res.send({ message: `Apartment ad ${id} updated with photos.` });
  });
};

const getAllApartments = (req, res) => {
  const sql = `
  SELECT a.*, u.FirstName, u.PhoneNumber
  FROM MyRentalAds a
  JOIN Users u ON a.user_email = u.Email
  WHERE a.IsRented = 0`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err.message);
      res.status(500).send("Error fetching available apartments");
    }
    if (rows.length === 0) {
      return res.status(404).send("No available apartments found");
    } else {
      return res.status(200).json(rows);
    }
  });
};

const getSingleApartmentInformation = (req, res) => {
  const ad_id = parseInt(req.params.ad_id, 10);

  const sql = `SELECT * FROM MyRentalAds WHERE id = ?`;

  db.get(sql, [ad_id], (err, row) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Error fetching apartment information");
    }
    if (!row) {
      return res.status(404).send("Apartment not found");
    } else {
      res.json(row);
    }
  });
};

const incrementApartmentViews = (req, res, next) => {
  const ad_id = parseInt(req.params.ad_id, 10);
  const currentUserEmail = req.headers["x-user-email"];
  console.log("ad_id", ad_id);
  console.log("currentUserEmail", currentUserEmail);
  if (!currentUserEmail) {
    return res.status(400).send("User email header is missing.");
  }

  const checkSql = `SELECT user_email FROM MyRentalAds WHERE id = ?`;
  db.get(checkSql, [ad_id], (checkErr, checkRow) => {
    if (checkErr) {
      console.error("Database error during check:", checkErr.message);
      return res.status(500).send("Error checking apartment existence");
    }
    if (!checkRow) {
      return res.status(404).send("Apartment not found");
    }
    if (checkRow.user_email !== currentUserEmail) {
      const updateSql = `UPDATE MyRentalAds SET viewsAmount = viewsAmount + 1 WHERE id = ?`;
      db.run(updateSql, [ad_id], (updateErr) => {
        if (updateErr) {
          console.error("Database error during update:", updateErr.message);
          return res.status(500).send("Error updating views count");
        }
        console.log(`Increased view count for apartment ID ${ad_id}`);
      });
    }
    next();
  });
};

const getAllAdsForOwner = (req, res) => {
  const Email = req.params.Email;

  const sql = "SELECT * FROM MyRentalAds WHERE user_email = ?";

  db.all(sql, [Email], (err, rows) => {
    if (err) {
      console.error("Database error:", err.message);
      res.status(500).send("Error fetching owner's apartment ads");
    }

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No ads found for the provided email" });
    } else {
      return res.status(200).json(rows);
    }
  });
};

const deleteApartmentAd = (req, res) => {
  const ad_id = parseInt(req.params.ad_id, 10);
  console.log("ad_id", ad_id);
  const sql = "DELETE FROM MyRentalAds WHERE id = ?";

  db.run(sql, [ad_id], function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Failed to delete apartment ad.");
    }
    if (this.changes > 0) {
      return res.status(200).send("Apartment ad deleted successfully.");
    } else {
      return res
        .status(404)
        .send("Apartment ad not found for the provided user.");
    }
  });
};

module.exports = {
  insertApartmentAd,
  savePDF,
  addPhotoToApartment,
  getAllApartments,
  getSingleApartmentInformation,
  incrementApartmentViews,
  getAllAdsForOwner,
  deleteApartmentAd,
};
