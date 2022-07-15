const mongoose = require("mongoose");
const Joi = require("joi");

const BDonate = mongoose.model(
	"BDonate",
	new mongoose.Schema({
		user: {
			type: new mongoose.Schema({
				name: {
					type: String,
					required: true,
					minlength: 3,
					maxlength: 40,
				},
			}),
			required: true,
		},
		bRequest: {
			type: new mongoose.Schema({
				name: {
					type: String,
					required: true,
					minlength: 3,
					maxlength: 40,
				},
				requestUser: {
					type: Object,
				},
			}),
			required: true,
		},
		dateDonated: {
			type: Date,
			required: true,
			default: Date.now,
		},
		isCompleted: {
			type: Boolean,
			default: false,
		},
	})
);

function validateBDonate(bDonate) {
	const schema = Joi.object({
		userId: Joi.objectId().required(),
		bRequestId: Joi.objectId().required(),
	});
	return (validation = schema.validate(bDonate));
}

exports.validation = validateBDonate;
exports.BDonate = BDonate;
