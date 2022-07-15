const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { BRequest } = require("../models/bRequest");
const { User } = require("../models/user");

//Get
router.get("/", async (req, res) => {
	const bRequests = await BRequest.find({
		isPublished: true,
		isCompleted: false,
	});
	res.send(bRequests);
});

router.put("/:id", async (req, res) => {
	let bRequest = await BRequest.findByIdAndUpdate(
		req.params.id,
		{ isCompleted: true },
		{ new: true }
	);
	bRequest = await bRequest.save();

	res.send(bRequest);
});

module.exports = router;
