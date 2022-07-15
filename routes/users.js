const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");

//Get
router.get("/", async (req, res) => {
	const users = await User.find().sort("name");
	res.send(users);
});

router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id).select("-password");
	res.send(user);
});

router.post("/", async (req, res) => {
	const { error } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ phone: req.body.phone });
	if (user) return res.status(400).send("User already registered");
	user = new User(
		_.pick(req.body, [
			"name",
			"phone",
			"location",
			"bloodGroup",
			"notification",
			"password",
		])
	);
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	user = await user.save();
	const token = jwt.sign(
		{
			_id: user._id,
			isAdmin: user.isAdmin,
			isMod: user.isMod,
			name: user.name,
			phone: user.phone,
		},
		config.get("jwtPrivateKey")
	);

	res
		.header("x-auth-token", token)
		.send(_.pick(user, ["_id", "name", "phone"]));
});

router.put("/:id", async (req, res) => {
	let user = await User.findByIdAndUpdate(
		req.params.id,
		{
			phone: req.body.phone,
			// password: req.body.password,
			name: req.body.name,
			location: req.body.location,
			bloodGroup: req.body.bloodGroup,
			notification: req.body.notify,
		},
		{ new: true }
	);
	// console.log(user);
	// console.log(user.password);
	// const salt = await bcrypt.genSalt(10);
	// {user.password ? user.password = await bcrypt.hash(user.password, salt)}

	user = await user.save();

	const token = jwt.sign(
		{
			_id: user._id,
			isAdmin: user.isAdmin,
			isMod: user.isMod,
			name: user.name,
			phone: user.phone,
		},
		config.get("jwtPrivateKey")
	);
	console.log(token);

	res
		.header("x-auth-token", token)
		.send(_.pick(user, ["_id", "name", "phone"]));
});

module.exports = router;
