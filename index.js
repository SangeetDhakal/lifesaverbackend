require("express-async-errors");
const mongoose = require("mongoose");
const config = require("config");

const express = require("express");
const app = express();
const users = require("./routes/users");
const bRequests = require("./routes/bRequests");
const publishbRequests = require("./routes/publishbRequests");
const completebRequests = require("./routes/completebRequests");
const bDonates = require("./routes/bDonates");
const completebDonates = require("./routes/completebDonates");
const auth = require("./routes/auth");
const showbDonates = require("./routes/showbDonates");
const error = require("./middleware/error");

if (!config.get("jwtPrivateKey")) {
	console.error("FATAL Error: JWT private key not defined");
	process.exit(1);
}

mongoose
	.connect("mongodb://localhost/lifeSaver")
	.then(() => console.log("Connected to MongoDB.."))
	.catch((err) => console.log("Error", err.message));

app.use(express.json());
require("./startup/logging");
app.use("/api/users", users);
app.use("/api/bRequests", bRequests);
app.use("/api/bDonates", bDonates);
app.use("/api/publishbRequests", publishbRequests);
app.use("/api/completebRequests", completebRequests);
app.use("/api/completebDonates", completebDonates);
app.use("/api/showbDonates", showbDonates);
app.use("/api/auth", auth);

app.use(error);

app.listen(4000, () => console.log("Listening on Port 4000"));
