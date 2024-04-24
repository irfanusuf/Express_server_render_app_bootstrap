const express = require("express");
const dbConnect = require("./config/connDb");
const {
  registerController,
  loginController,
} = require("./controllers/userController");
const bodyParser = require("body-parser");
const authenticated = require("./auth/auth");
const cookieParser = require("cookie-parser");
const port = 4000;

const app = express();

dbConnect();

//middle wares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())

// middle ware for setting view engine

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/dashboard", authenticated, (req, res) => {res.render("dashboard");});

app.post("/register", registerController);
app.post("/login", loginController);

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
