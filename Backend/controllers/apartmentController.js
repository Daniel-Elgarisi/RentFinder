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

  const sql = `
  SELECT a.*, u.FirstName, u.PhoneNumber
  FROM MyRentalAds a
  JOIN Users u ON a.user_email = u.Email
  WHERE a.id = ? AND a.IsRented = 0
  `;
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

  if (isNaN(ad_id)) {
    return res.status(400).json({ message: "Ad ID must be a number." });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    const deleteRequestsSql = "DELETE FROM RequestsOfInterest WHERE ad_id = ?";

    db.run(deleteRequestsSql, [ad_id], function (err) {
      if (err) {
        console.error("Database error:", err.message);
        db.run("ROLLBACK;");
        return res
          .status(500)
          .send("Failed to delete related requests of interest.");
      }

      const deleteAdSql = "DELETE FROM MyRentalAds WHERE id = ?";

      db.run(deleteAdSql, [ad_id], function (err) {
        if (err) {
          console.error("Database error:", err.message);
          db.run("ROLLBACK;");
          return res.status(500).send("Failed to delete apartment ad.");
        }

        if (this.changes > 0) {
          db.run("COMMIT;");
          return res.status(200).send("Apartment ad deleted successfully.");
        } else {
          db.run("ROLLBACK;");
          return res
            .status(404)
            .send("Apartment ad not found for the provided ID.");
        }
      });
    });
  });
};

const sendRequestOfInterest = (req, res) => {
  const ad_id = parseInt(req.params.ad_id, 10);
  const { Email, notes } = req.body;
  console.log("ad_id: ", ad_id);
  console.log("Email: ", Email, "notes: ", notes);

  if (isNaN(ad_id)) {
    return res.status(400).json({ message: "Apartment ID must be a number." });
  }

  const sql = `INSERT INTO RequestsOfInterest (ad_id, interested_email, is_approve, notes, is_rejected) VALUES (?, ?, 0, ?, 0)`;
  db.run(sql, [ad_id, Email, notes], function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Failed to send request of interest.");
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.status(200).send({
      message: `Request of interest sent successfully with ID ${this.lastID}`,
      requestId: this.lastID,
    });
  });
};

const deleteRequestOfInterest = (req, res) => {
  const request_id = parseInt(req.params.id, 10);
  console.log("request_id", request_id);

  if (isNaN(request_id)) {
    return res.status(400).json({ message: "Request ID must be a number." });
  }

  const sql = "DELETE FROM RequestsOfInterest WHERE id = ?";

  db.run(sql, [request_id], function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Failed to delete request of interest.");
    }
    if (this.changes > 0) {
      return res.status(200).send("Request of interest deleted successfully.");
    } else {
      return res
        .status(404)
        .send("Request of interest not found for the provided ID.");
    }
  });
};

const getUnapprovedRequests = (req, res) => {
  const ownerEmail = req.params.Email;

  if (!ownerEmail) {
    return res.status(400).json({ message: "Owner email is required." });
  }

  const sql = `
    SELECT 
      r.*,
      a.price,
      a.imageUrl1,
      a.city,
      a.address,
      a.apartment_number,
      a.rooms,
      a.floor,
      a.square_meter,
      u.FirstName,
      u.PhoneNumber
    FROM 
      RequestsOfInterest r
    JOIN 
      MyRentalAds a ON r.ad_id = a.id
    JOIN 
      Users u ON r.interested_email = u.Email
    WHERE 
      a.user_email = ? AND r.is_approve = 0 AND r.is_rejected = 0;
  `;

  db.all(sql, [ownerEmail], (err, rows) => {
    if (err) {
      console.error("Database error:", err.message);
      res.status(500).send("Error fetching requests of interest");
      return;
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "No unapproved requests found" });
    } else {
      return res.status(200).json(rows);
    }
  });
};

const getRequestOfInterest = (req, res) => {
  const Email = req.params.Email;

  if (!Email) {
    return res.status(400).json({ message: "User email is required." });
  }

  const sql = `
    SELECT 
      r.*,
      a.price,
      a.imageUrl1,
      a.city,
      a.address,
      a.apartment_number,
      a.rooms,
      a.floor,
      a.square_meter,
      u.FirstName,
      u.PhoneNumber
    FROM 
      RequestsOfInterest r
    INNER JOIN 
      MyRentalAds a ON r.ad_id = a.id
    INNER JOIN 
      Users u ON a.user_email = u.Email
    WHERE 
      r.interested_email = ?;
  `;

  db.all(sql, [Email], (err, rows) => {
    if (err) {
      console.error("Database error:", err.message);
      res.status(500).send("Error fetching requests of interest");
      return;
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "No requests found" });
    } else {
      return res.status(200).json(rows);
    }
  });
};

const approveRequestOfInterest = (req, res) => {
  const ad_id = parseInt(req.params.ad_id, 10);
  const request_id = parseInt(req.body.id, 10);

  if (isNaN(ad_id) || isNaN(request_id)) {
    return res.status(400).send("Invalid apartment ID or request ID.");
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    const updateRequestSql = `UPDATE RequestsOfInterest SET is_approve = 1 WHERE id = ? AND ad_id = ?`;
    db.run(updateRequestSql, [request_id, ad_id], function (err) {
      if (err) {
        console.error("Error updating RequestsOfInterest:", err.message);
        db.run("ROLLBACK;");
        return res
          .status(500)
          .send("Failed to approve the request of interest.");
      }

      if (this.changes === 0) {
        db.run("ROLLBACK;");
        return res
          .status(404)
          .send("Request of interest not found or already approved.");
      }

      const updateAdSql = `UPDATE MyRentalAds SET IsRented = 1 WHERE id = ?`;
      db.run(updateAdSql, [ad_id], function (err) {
        if (err) {
          console.error("Error updating MyRentalAds:", err.message);
          db.run("ROLLBACK;");
          return res
            .status(500)
            .send("Failed to mark the apartment as rented.");
        }

        if (this.changes === 0) {
          db.run("ROLLBACK;");
          return res
            .status(404)
            .send("Apartment ad not found or already rented.");
        }

        db.run("COMMIT;", (err) => {
          if (err) {
            console.error("Error committing the transaction:", err.message);
            return res.status(500).send("Failed to commit the transaction.");
          }
          return res
            .status(200)
            .send(
              "Request of interest approved and apartment marked as rented successfully."
            );
        });
      });
    });
  });
};

const rejectRequestOfInterest = (req, res) => {
  const request_id = parseInt(req.params.request_id, 10);
  console.log("request_id: ", request_id);

  if (isNaN(request_id)) {
    return res.status(400).send("Invalid request ID.");
  }

  const sql = `UPDATE RequestsOfInterest SET is_rejected = 1 WHERE id = ?`;
  db.run(sql, [request_id], function (err) {
    if (err) {
      console.error("Error updating RequestsOfInterest:", err.message);
      return res.status(500).send("Failed to reject the request of interest.");
    }

    if (this.changes === 0) {
      return res
        .status(404)
        .send("Request of interest not found or already rejected.");
    } else {
      return res.status(200).send("Request of interest rejected successfully.");
    }
  });
};

const getAmountOfRequestOfRequest = (req, res) => {
  const Email = req.params.Email;

  if (!Email) {
    return res.status(400).json({ message: "User email is required." });
  }

  const receivedRequestsSql = `
    SELECT COUNT(*) AS count
    FROM RequestsOfInterest r
    JOIN MyRentalAds a ON r.ad_id = a.id
    WHERE a.user_email = ? AND r.is_approve = 0 AND r.is_rejected = 0
  `;

  const submittedRequestsSql = `
    SELECT COUNT(*) AS count
    FROM RequestsOfInterest
    WHERE interested_email = ? AND ((is_approve = 1 AND is_rejected = 0) OR (is_approve = 0 AND is_rejected = 1))
  `;

  db.get(receivedRequestsSql, [Email], (err, receivedRow) => {
    if (err) {
      console.error("Database error (received requests):", err.message);
      return res.status(500).send("Error fetching received requests count.");
    }

    db.get(submittedRequestsSql, [Email], (err, submittedRow) => {
      if (err) {
        console.error("Database error (submitted requests):", err.message);
        return res.status(500).send("Error fetching submitted requests count.");
      }

      const totalAmount = receivedRow.count + submittedRow.count;
      return res.status(200).json({ totalAmount });
    });
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
  sendRequestOfInterest,
  deleteRequestOfInterest,
  getUnapprovedRequests,
  getRequestOfInterest,
  approveRequestOfInterest,
  rejectRequestOfInterest,
  getAmountOfRequestOfRequest,
};
