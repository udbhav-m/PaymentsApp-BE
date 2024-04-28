const express = require("express");
const cors = require("cors");
const userRouter = require("./Routes/user");
const { dbConnect } = require("./DB/mongoose");
const accountRouter = require("./Routes/account");

const app = express();
app.use(express.json());
app.use(cors());

// sends all user requests to user router
app.get("/", (req, res) => res.send("Express on Vercel"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

dbConnect();

app.listen(3000, () => {
  console.log("app running on localhost:3000");
});
