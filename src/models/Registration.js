const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    installationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80
    },

    registeredAt: {
      type: Date,
      default: Date.now,
      immutable: true
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

module.exports = Registration;