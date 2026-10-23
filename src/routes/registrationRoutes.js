const express = require("express");

const {
  registerInstallation,
  updateRegistrationName
} = require("../controllers/registrationController");

const router = express.Router();

router.post(
  "/",
  registerInstallation
);

router.patch(
  "/:installationId",
  updateRegistrationName
);

module.exports = router;