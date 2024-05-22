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

const port = 3000;

const app = express();

// middle ware for setting view engine

app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views' ,'pages'));



app.engine("hbs",exphbs.engine({

  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views" , "partials"),


}))





dbConnect();
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
app.get("/blogs" , (req, res) => {res.render("blogs" , {pageTitle : "ROBOMEOW | BLOGS"} );});
app.get("/blogs/:params" , (req, res) => {res.render("eachBlog" , {pageTitle : "ROBOMEOW | BLOG"} );});
app.get("/faq" , (req, res) => {res.render("faq" , {pageTitle : "ROBOMEOW | FAQ"} );});


// backend Controller Routes
   
app.post("/register", registerController);
app.post("/login", loginController);
app.delete('/user/del/me'), delUserController

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
