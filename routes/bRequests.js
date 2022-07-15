const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { BRequest, validateBRequest } = require("../models/bRequest");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const mod = require("../middleware/mod");

//Get
router.get("/", async (req, res) => {
	const bRequests = await BRequest.find({
		isPublished: true,
		isCompleted: false,
	});
	res.send(bRequests);
	// console.log(bRequests);
});

router.post("/", async (req, res) => {
	const { error } = validateBRequest(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const user = await User.findById(req.body.user);
	if (!user) return res.status(400).send("Invalid User");
	let bRequest = new BRequest({
		name: req.body.name,
		phone: req.body.phone,
		location: req.body.location,
		bloodGroup: req.body.bloodGroup,
		quantity: req.body.quantity,
		hospital: req.body.hospital,
		reason: req.body.reason,
		description: req.body.description,
		user: {
			_id: user._id,
			name: user.name,
			phone: user.phone,
		},
	});
	bRequest = await bRequest.save();

	res.send(bRequest);
	// user.bloodRequests.push(bRequest);
	// user.save();
});
module.exports = router;
