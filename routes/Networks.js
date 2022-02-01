const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { NewNetwork, User } = require("../models/Networks");
const JWT_STRING = "kfkjfkjfdkjakdjferuej#$#$#2u3@#@$@kfj";
const {
  getAllNetworks,
  createNetwork,
  getNetwork,
  updateNetwork,
  deleteNetwork,
} = require("../controllers/Networks");

router.route("/v1/networks").post(createNetwork);
router.route("/v1/get-user-specific-networks").post(getAllNetworks);
router
  .route("/v1/networks/:id")
  .get(getNetwork)
  .patch(updateNetwork)
  .delete(deleteNetwork);
router.route("/register").post(async (req, res) => {
  const { username, password: plainPassword } = req.body;
  //console.log(await bcrypt.hash(password, 5));
  if (!username) {
    return res.json({
      status: "error",
      error: "Invalid username/ no username",
    });
  }
  if (!plainPassword) {
    return res.json({
      status: "error",
      error: "Invalid password",
    });
  }
  const password = await bcrypt.hash(plainPassword, 5);
  try {
    const user = await User.create({ username, password });
    console.log(user);
    res.json(user);
  } catch (error) {
    //JSON.stringify(error);
    if (error.code === 11000) {
      console.log(error);
      return res.json({ status: "error", error: "username already in use" });
    }
    throw error;
  }
});
router.route("/users/login").post(async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ status: "error", error: "invalid username/password" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          _id: user._id,
          username,
        },
        JWT_STRING
      );
      return res.json({ status: "ok", data: token });
    }
    res.json({ status: "error", error: "invalid username/password" });
  } catch (error) {
    console.log(error);
    //return res.json({ status: error });
  }
});
router.route("/user-specific-netowrk").post(async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, JWT_STRING);
  //console.log(user);
  try {
    const userID = user._id;
    await NewNetwork.create({ ...req.body, userID });
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: error, error: "unkown" });
  }
});
module.exports = router;
