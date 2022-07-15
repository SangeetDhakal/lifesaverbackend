const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");

//Get
router.get("/", async (req, res) => {
	const users = await User.find().sort("name");
	res.send(users);
});

router.post("/", async (req, res) => {
	let user = new User({
		name: req.body.name,
		phone: req.body.phone,
		location: req.body.location,
		bloodGroup: req.body.bloodGroup,
		notification: req.body.notification,
		password: req.body.password,
	});
	user = await user.save();
	res.send(user);
});

module.exports = router;
