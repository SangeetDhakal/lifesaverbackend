const mongoose = require("mongoose");
const Joi = require("joi");
const { userSchema } = require("./user");

const bDSchema = new mongoose.Schema({
	name: {
		type: Object,
		required: true,
	},
	
});

const bRequestSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 40,
	},
	phone: {
		type: String,
		required: true,
		minlength: 10,
		maxlength: 10,
	},
	location: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 40,
	},
	bloodGroup: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		maxlength: 2,
	},
	hospital: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 40,
	},
	isPublished: {
		type: Boolean,
		default: false,
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
	reason: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 40,
	},
	description: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
	},
	dateRequested: {
		type: Date,
		required: true,
		default: Date.now,
	},
	bloodDonates: [bDSchema],
	user: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,
				minlength: 3,
				maxlength: 40,
			},
			phone: {
				type: String,
				required: true,
				minlength: 10,
				maxlength: 10,
			},
		}),
	},
});

const BRequest = mongoose.model("BRequest", bRequestSchema);

function validateBRequest(bRequest) {
	const schema = Joi.object({
		name: Joi.string().required().min(3),
		phone: Joi.string().required().min(10).max(10),
		location: Joi.string().required().min(3).max(40),
		bloodGroup: Joi.string().required().min(1).max(10),
		quantity: Joi.number().required().min(1).max(10),
		hospital: Joi.string().required().min(3).max(40),
		reason: Joi.string().required().min(3).max(40),
		description: Joi.string().required().min(3).max(255),
		user: Joi.string(),
	});
	return (validation = schema.validate(bRequest));
}

exports.bRequestSchema = bRequestSchema;
exports.validateBRequest = validateBRequest;
exports.BRequest = BRequest;
