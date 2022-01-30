const { NewNetwork, User } = require("../models/Networks");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");
const getAllNetworks = asyncWrapper(async (req, res) => {
  const networks = await NewNetwork.find({});
  res.status(200).json({ networks });
});

const createNetwork = asyncWrapper(async (req, res) => {
  const networks = await NewNetwork.create(req.body);

  res.status(201).json({ networks });
});

const getNetwork = asyncWrapper(async (req, res, next) => {
  const { id: networkID } = req.params;
  const network = await NewNetwork.findOne({ _id: networkID });
  if (!network) {
    return next(createCustomError(`No Network with id : ${networkID}`, 404));
  }

  res.status(200).json({ network });
});
const deleteNetwork = asyncWrapper(async (req, res, next) => {
  const { id: networkID } = req.params;
  const network = await NewNetwork.findOneAndDelete({ _id: networkID });
  if (!network) {
    return next(createCustomError(`No Network with id : ${networkID}`, 404));
  }
  res.status(200).json({ network });
});
const updateNetwork = asyncWrapper(async (req, res, next) => {
  const { id: networkID } = req.params;

  const network = await NewNetwork.findOneAndUpdate(
    { _id: networkID },
    req.body,
    {
      new: true,
    }
  );

  if (!network) {
    return next(createCustomError(`No task with id : ${networkID}`, 404));
  }

  res.status(200).json({ network });
});

module.exports = {
  getAllNetworks,
  createNetwork,
  getNetwork,
  updateNetwork,
  deleteNetwork,
};
