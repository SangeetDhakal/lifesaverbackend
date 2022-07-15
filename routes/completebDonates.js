const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { BDonate } = require("../models/bDonate");
const { User } = require("../models/user");
const { BRequest } = require("../models/bRequest");
const mod = require("../middleware/mod");
const auth = require("../middleware/auth");

router.get("/", [auth, mod], async (req, res) => {
	const bDonate = await BDonate.find({
		isCompleted: false,
	});
	res.send(bDonate);
});
router.put("/:id", [auth, mod], async (req, res) => {
	let bDonate = await BDonate.findByIdAndUpdate(
		req.params.id,
		{ isCompleted: true },
		{ new: true }
	);
	bDonate = await bDonate.save();

	const user = await User.findById(bDonate.user._id.toString());
	if (!user) return res.status(400).send("Invalid User");

	const bRequest = await BRequest.findById(bDonate.bRequest._id.toString());
	if (!bRequest) return res.status(400).send("Invalid Blood Request");

	bRequest.bloodDonates.push(bDonate.user);
	bRequest.save();
	user.bloodDonated.push(bRequest.user);

	user.save();

	//Get ID of Request and Requesting User
	const requestId = bRequest._id;
	const userId = bRequest.user._id.toString();

	const updateUser = await User.findById({ _id: userId });
	if (!updateUser) return res.status(400).send("Invalid User");
	req = updateUser.bloodRequests;
	const ans = req.findIndex(function (obj) {
		return obj.id == requestId;
	});
	req[ans].donatedBy.push(bDonate.user);

	updateUser.save();
	res.send(updateUser);
});

router.delete("/:id", [auth, mod], async (req, res) => {
	let bDonate = await BDonate.findByIdAndRemove(req.params.id);
	if (!bDonate) return res.status(404).send("Invalid Donation");
	res.send(bDonate);
});

module.exports = router;
