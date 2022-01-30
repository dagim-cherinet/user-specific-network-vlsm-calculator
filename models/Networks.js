const mongoose = require("mongoose");

const NetworkSchema = new mongoose.Schema({
  userID: {
    type: String,
  },
  network_name: {
    type: String,
    default: "no name",
    trim: true,
  },
  network_address: {
    type: String,
    default: "0.0.0.0",
    trim: true,
  },
  subnet_mask: {
    type: String,
    default: "0.0.0.0",
    trim: true,
  },
  number_of_allocated_IP: {
    type: String,
    default: "0.0.0.0",
    trim: true,
    maxlength: [20, " address can not be more than 20 characters"],
  },
  number_of_usable_hosts: {
    type: String,
    default: "0.0.0.0",
    trim: true,
  },
  number_of_hosts_wasted: {
    type: String,
    default: "0.0.0.0",
    trim: true,
  },
  first_host_address: {
    type: String,
    default: "0.0.0.0",
    trim: true,
  },
  last_host_address: {
    type: String,
    default: "0.0.0.0",
    trim: true,
  },
  broadcast_address: {
    type: String,
    default: "0.0.0.0",
    trim: true,
  },
});
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const NewNetwork = mongoose.model("NewNetwork", NetworkSchema);
const User = mongoose.model("User", userSchema);
module.exports = { User, NewNetwork };

// module.exports = mongoose.model("network", NetworkSchema);
