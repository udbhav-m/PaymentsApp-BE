const jwt = require("jsonwebtoken");
let secretkey = process.env.SECRET_KEY;

const generateToken = (email, key) => {
  let token = jwt.sign(email, key);
  if (token) {
    return token;
  } else {
    console.log("Error while generating token");
    throw new Error("Error while generating token");
  }
};

function authenticate(req, res, next) {
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, secretkey, (err, email) => {
      if (err) {
        res.status(403).json({ error: "Authentication failed" });
      }
      if (!email || email == undefined) {
        res.status(403).json({ error: "Authentication failed" });
      }
      console.log("welcome user: ", email);
      req.headers.email = email;
      next();
    });
  } else {
    res.status(403).json({ error: "Authentication failed invalid token" });
  }
}

module.exports = {
  generateToken,
  authenticate,
};
