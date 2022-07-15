const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const bRSchema = new mongoose.Schema({
	name: {
		type: Object,
		require: true,
	},
	reason: {
		type: Object,
	},
	dateRequested: {
		type: Object,
	},
	quantity: {
		type: Object,
	},
	donatedBy: [
		{
			type: Object,
		},
	],
});

const bDonated = new mongoose.Schema({
	name: {
		type: Object,
		require: true,
	},
	reason: {
		type: Object,
	},
	dateDonated: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const userSchema = new mongoose.Schema({
	phone: {
		type: String,
		required: true,
		minlength: 10,
		maxlength: 10,
	},
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 40,
	},
	location: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 40,
	},
	password: {
		type: String,
		required: true,
		minlength: 3,
	},
	bloodGroup: {
		type: String,
		required: true,
	},
	notification: {
		type: Boolean,
		default: true,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	isMod: {
		type: Boolean,
		default: false,
	},

	isActive: {
		type: Boolean,
		default: true,
	},
	dateRegistered: {
		type: Date,
		required: true,
		default: Date.now,
	},
	bloodRequests: [bRSchema],
	bloodDonated: [bDonated],
});
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			isAdmin: this.isAdmin,
			isMod: this.isMod,
			name: this.name,
			phone: this.phone,
		},
		config.get("jwtPrivateKey")
	);
	return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().required().min(3),
		phone: Joi.string().required().min(10).max(10),
		location: Joi.string().required().min(3).max(40),
		password: Joi.string().required().min(3),
		bloodGroup: Joi.string().required().min(1).max(10),
		notification: Joi.boolean().required(),
	});
	return (validation = schema.validate(user));
}

exports.userSchema = userSchema;
exports.validateUser = validateUser;
exports.User = User;
