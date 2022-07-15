const mongoose = require("mongoose");
const express = require("express");
const mod = require("../middleware/mod");
const auth = require("../middleware/auth");
const router = express.Router();
const { BDonate } = require("../models/bDonate");
const { User } = require("../models/user");
const { BRequest } = require("../models/bRequest");

router.get("/", async (req, res) => {
	const bDonate = await BDonate.find({
		isCompleted: false,
	});
	res.send(bDonate);
});

router.post("/", auth, async (req, res) => {
	const user = await User.findById(req.body.user);
	if (!user) return res.status(400).send("Invalid User");

	const bRequest = await BRequest.findById(req.body.bRequest);
	if (!bRequest) return res.status(400).send("Invalid Blood Request");

	let bDonate = new BDonate({
		user: {
			_id: user._id,
			name: user.name,
			phone: user.phone,
		},
		bRequest: {
			_id: bRequest._id,
			name: bRequest.name,
			requestUser: bRequest.user,
			phone: bRequest.phone,
		},
	});
	bDonate = await bDonate.save();
	// check = bDonate;
	// // console.log(bDonate);

	res.send(bDonate);
});

module.exports = router;
