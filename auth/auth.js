const jwt = require("jsonwebtoken");

const authenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).render("login" , { message: "Unauthorized , Please Login again!" });
    } else {
      await jwt.verify(token, "thodfsoivjmnifu", (err, decode) => {
        if (err) {
          res.status(403).render("login" , { message: "Something Went Wrong , Please Login again!" });
        } else {
          req.info = decode;
          return next();
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticated;
