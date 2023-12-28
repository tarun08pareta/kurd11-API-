const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    // mobileNumber: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    //   required: false,
    //   unique: false,
    },
    accessToken: {
      type: String,
      unique: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    createdAt: { 
      type: Date, 
      required: true,
      unique: false,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: false,
      unique: false,
      default: Date.now,
    },
    appLanguage: {
      type: String,
      required: false,
      unique: false,
    },
    // adhaarNumber: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // isMobileVerified: {
    //   type: Boolean,
    //   default: false,
    // },
  })
);

module.exports = User;