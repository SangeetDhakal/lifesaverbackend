module.exports = function (req, res, next) {
	if (!req.user.isMod) return res.status(403).send("Forbidden");

	next();
};
