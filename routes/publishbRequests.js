const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { BRequest } = require("../models/bRequest");
const { User } = require("../models/user");
const mod = require("../middleware/mod");
const auth = require("../middleware/auth");

//Get
router.get("/", async (req, res) => {
	const bRequests = await BRequest.find({
		isPublished: false,
		isCompleted: false,
	});
	res.send(bRequests);
});

router.put("/:id", [auth, mod], async (req, res) => {
	let bRequest = await BRequest.findByIdAndUpdate(
		req.params.id,
		{ isPublished: true },
		{ new: true }
	);
	bRequest = await bRequest.save();

	res.send(bRequest);
	const user = await User.findById(bRequest.user._id.toString());
	if (!user) return res.status(400).send("Invalid User");
	user.bloodRequests.push(bRequest);
	user.save();
});

router.delete("/:id", [auth, mod], async (req, res) => {
	let bRequest = await BRequest.findByIdAndRemove(req.params.id);
	if (!bRequest) return res.status(404).send("Invalid Customer");
	res.send(bRequest);
});

module.exports = router;
