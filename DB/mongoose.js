const mongoose = require("mongoose");

const paytmUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const bankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paytmUser",
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const paytmUser = new mongoose.model("paytmUser", paytmUserSchema);
const bank = new mongoose.model("bank", bankSchema);

let MONGO = process.env.MONGO;

async function dbConnect() {
  if (!MONGO && MONGO == undefined) {
    console.log("Invaild mongo url", MONGO);
  } else {
    await mongoose.connect(MONGO);
    console.log("connected to mongo");
  }
}

module.exports = { paytmUser, paytmUserSchema, dbConnect, bank };
