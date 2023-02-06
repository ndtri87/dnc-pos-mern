const mongoose = require("mongoose");

const userShema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    verified: {
      type: Boolean,
    },
  },
  {
    timestamp: true,
  }
);

const Users = mongoose.model("users", userShema);
module.exports = Users;
