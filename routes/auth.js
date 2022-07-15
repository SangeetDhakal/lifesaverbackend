const _ = require("lodash");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { User } = require("../models/user");

//Post
router.post("/", async (req, res) => {
	const { error } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ phone: req.body.phone });
	if (!user) return res.status(400).send("Phone not in DB");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid password");

	const token = user.generateAuthToken();
	res.send(token);
});

function validateUser(req) {
	const schema = Joi.object({
		phone: Joi.string().min(10).max(10),
		password: Joi.required(),
	});
	return (validation = schema.validate(req));
}
module.exports = router;
