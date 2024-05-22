const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { connection } = require("../config/connDbSQL");
const { connections, connect } = require("mongoose");

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

// const loginController = async (req, res) => {
//   const { email, password } = req.body;

//   let isUser = await User.findOne({ email });

//   if (email && password !== "") {
//     if (isUser) {
//       const verify = await bcrypt.compare(password, isUser.password);

//       if (verify) {
//         const token = await jwt.sign({ userId: isUser._id }, "thodfsoivjmnifu");

//         res.cookie("token", token, {
//           httpOnly: true,
//           maxAge: 24 * 60 * 60 * 1000,
//           secure: true,
//         });

//         res.redirect("dashboard");
//       } else {
//         res.render("login", { message: "Password Doesnt match!" });
//       }
//     } else {
//       res.render("login", { message: "User not Found!" });
//     }
//   } else {
//     res.render("login", { message: "All credentials Required" });
//   }
// };

const registerController = async (req, res) => {
  const { username, email, password } = req.body;
  const passHash = await bcrypt.hash(password, 10);

  if (username !== "" && email !== "" && password !== "") {
    const selectQuery = `SELECT * FROM users WHERE email = ?`;

    connection.query(selectQuery, [email], (err, result) => {
      if (err) {
        console.log(err);
        res.render("register", { message: "Database Error" });

        return;
      }

      if (result.length > 0) {
        res.render("register", { message: "User Already Exists!" });
      } else {
        const userID = uuidv4();
        const values = [userID, username, email, passHash];
        const insertQuery = `INSERT INTO users  VALUES (?,?,?,?)`;

        connection.query(insertQuery, values, (err) => {
          if (err) {
            console.log(err);
            res.render("register", { message: "Database Error" });
          }
          res.redirect("login");
        });
      }
    });
  } else {
    res.render("register", { message: "All credentials Required !" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const callback = async (err, result) => {
      if (err) {
        console.log(err);
        res.render("login", { message: "Database Error" });
        return;
      }
      if (result.length > 0) {
        const comparePass = await bcrypt.compare(password, result[0].password);
        if (comparePass) {
          const token = await jwt.sign(
            { userId: result[0].userId },
            "thodfsoivjmnifu"
          );

          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
          });
      


          // res.render("login" , {sucessMessage : "logged in Succesfully "})
          res.redirect("/dashboard");
        } else {
          res.render("login", { message: "Incorrect pass" });
        }
      } else {
        res.render("login", { message: "User not found" });
      }
    };

    if (email && password !== "") {
      const selectQuery = `SELECT * FROM users WHERE email = ?`;
      connection.query(selectQuery, [email], callback);
    } else {
      res.render("login", { message: "All credentials Required" });
    }
  } catch (error) {
    console.log(error);
  }
};





const delUserController = async (req,res) =>{



}

module.exports = { registerController, loginController ,delUserController};
