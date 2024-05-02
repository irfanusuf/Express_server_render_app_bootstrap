const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");




const dbConnect = require("./config/connDb");

const {connSqlDB} = require("./config/connDbSQL")

const {
  registerController,
  loginController,
  delUserController,
} = require("./controllers/userController");

const authenticated = require("./auth/auth");

const port = 4000;

const app = express();

// middle ware for setting view engine

app.engine("hbs",exphbs.engine({

  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views" , "partials"),


}))

app.set("view engine", "hbs");



// dbConnect();
connSqlDB()

//middle wares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join (__dirname , "public")))



// get Routes

app.get("/", (req, res) => {res.render("home",  {pageTitle : "ROBOMEOW | HOME"} );});
app.get("/register", (req, res) => {res.render("register", {pageTitle : "ROBOMEOW | REGISTER"} );});
app.get("/login", (req, res) => {res.render("login" , {pageTitle : "ROBOMEOW | LOGIN"} );});
app.get("/dashboard", authenticated, (req, res) => {res.render("dashboard" , {pageTitle : "ROBOMEOW | DASHBOARD"} );});


// backend Controller Routes
   
app.post("/register", registerController);
app.post("/login", loginController);
app.delete('/user/del/me'), delUserController

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
