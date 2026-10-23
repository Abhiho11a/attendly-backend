const Registration = require("../models/Registration");

const sanitizeName = (name) => {
  return String(name || "").trim();
};

const sanitizeInstallationId = (installationId) => {
  return String(installationId || "").trim();
};

/**
 * POST /api/registrations
 *
 * Creates a registration if installationId does not already exist.
 * If it already exists, the existing registration is returned.
 */
const registerInstallation = async (req, res, next) => {
  try {
    const installationId = sanitizeInstallationId(
      req.body.installationId
    );

    const name = sanitizeName(req.body.name);

    if (!installationId) {
      return res.status(400).json({
        success: false,
        message: "installationId is required"
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required"
      });
    }

    if (installationId.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Invalid installationId"
      });
    }

    if (name.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must not exceed 80 characters"
      });
    }

    let registration = await Registration.findOne({
      installationId
    });

    if (registration) {
      return res.status(200).json({
        success: true,
        message: "Installation already registered",
        data: {
          installationId: registration.installationId,
          name: registration.name,
          registeredAt: registration.registeredAt,
          updatedAt: registration.updatedAt
        }
      });
    }

    registration = await Registration.create({
      installationId,
      name
    });

    return res.status(201).json({
      success: true,
      message: "Installation registered successfully",
      data: {
        installationId: registration.installationId,
        name: registration.name,
        registeredAt: registration.registeredAt,
        updatedAt: registration.updatedAt
      }
    });
  } catch (error) {
    /*
     * MongoDB unique-index race condition protection.
     */
    if (error.code === 11000) {
      try {
        const registration = await Registration.findOne({
          installationId: req.body.installationId
        });

        return res.status(200).json({
          success: true,
          message: "Installation already registered",
          data: {
            installationId: registration.installationId,
            name: registration.name,
            registeredAt: registration.registeredAt,
            updatedAt: registration.updatedAt
          }
        });
      } catch (secondaryError) {
        return next(secondaryError);
      }
    }

    next(error);
  }
};

/**
 * PATCH /api/registrations/:installationId
 *
 * Updates the display name of an existing registration.
 */
const updateRegistrationName = async (req, res, next) => {
  try {
    const installationId = sanitizeInstallationId(
      req.params.installationId
    );

    const name = sanitizeName(req.body.name);

    if (!installationId) {
      return res.status(400).json({
        success: false,
        message: "installationId is required"
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required"
      });
    }

    if (name.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must not exceed 80 characters"
      });
    }

    const registration = await Registration.findOneAndUpdate(
      { installationId },
      {
        $set: {
          name,
          updatedAt: new Date()
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      data: {
        installationId: registration.installationId,
        name: registration.name,
        registeredAt: registration.registeredAt,
        updatedAt: registration.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerInstallation,
  updateRegistrationName
};