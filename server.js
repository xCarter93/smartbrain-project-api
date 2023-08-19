require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const saltRounds = 10;
const knex = require("knex");

const register = require("./conrollers/register");
const signin = require("./conrollers/signin");
const profile = require("./conrollers/profile");
const image = require("./conrollers/image");

const db = knex({
	client: "pg",
	connection: {
		ssl: { rejectUnauthorized: false },
		connectionString: process.env.POSTGRES_URL,
		host: process.env.POSTGRES_HOST,
		port: 5432,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PW,
		database: process.env.POSTGRES_DB,
	},
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.status(200).json("Success");
});

app.post("/signin", (req, res) => {
	signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
	register.handleRegister(req, res, db, bcrypt, saltRounds);
});

app.get("/profile/:id", (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
	image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

app.listen(5000, () => {
	console.log("App is running...");
});

export default app;
