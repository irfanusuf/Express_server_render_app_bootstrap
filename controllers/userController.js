const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { connection } = require("../config/connDbSQL");
const { connections } = require("mongoose");

// const registerController = async (req, res) => {
//   const { username, email, password } = req.body;

//   let user = await User.findOne({ email });
//   let encrytpass = await bcrypt.hash(password, 10);

//   if (username && email && password !== "") {
//     if (!user) {
//       const newUser = await new User({ username, email, password: encrytpass });
//       await newUser.save();
//       res.redirect("login");
//     } else {
//       res.render("register", { message: "User already exists!" });
//     }
//   } else {
//     res.render("register", { message: "All credentials Required!" });
//   }
// };

const loginController = async (req, res) => {
  const { email, password } = req.body;

  let isUser = await User.findOne({ email });

  if (email && password !== "") {
    if (isUser) {
      const verify = await bcrypt.compare(password, isUser.password);

      if (verify) {
        const token = await jwt.sign({ userId: isUser._id }, "thodfsoivjmnifu");

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
        });

        res.redirect("dashboard");
      } else {
        res.render("login", { message: "Password Doesnt match!" });
      }
    } else {
      res.render("login", { message: "User not Found!" });
    }
  } else {
    res.render("login", { message: "All credentials Required" });
  }
};

const registerController = async (req, res) => {
  const { username, email, password } = req.body;
  const userID = uuidv4();
  const values = [userID, username, email, password];
  const query = `INSERT INTO users  VALUES (?,?,?,?)`;
  const Query = `SELECT * FROM users WHERE email = ?`;

  connection.query(Query, [email], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length > 0) {
      res.render('register' , { message: "User Already Exists!" });
    } else 
    
    {
      connection.query(query, values, (err, result) => {
        if (err) {
          console.log(err);
        }
        res.redirect('login');
      
      });
    }
  });
};

module.exports = { registerController, loginController };
