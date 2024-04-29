const jwt = require("jsonwebtoken");
let secretkey = process.env.SECRET_KEY;

const generateToken = (dataJson, key) => {
  let token = jwt.sign(dataJson, key);
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
    jwt.verify(token, secretkey, (err, data) => {
      if (err) {
        res.status(403).json({ error: "Authentication failed" });
      }
      if (!data || data == undefined) {
        res.status(403).json({ error: "Authentication failed" });
      }

      const { email, _id, firstname } = data;
      console.log("welcome user at auth: ", email);
      req.headers.email = email;
      req.headers._id = _id;
      req.headers.firstname = firstname;
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
