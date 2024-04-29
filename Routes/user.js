const express = require("express");
const { generateToken, authenticate } = require("../Authentication/auth");
const { userZod, loginZod, updateZod } = require("../common/zod");
const { paytmUser, bank } = require("../DB/mongoose");

const userRouter = express.Router();
let secretkey = process.env.SECRET_KEY 

userRouter.get("/me", authenticate, async (req, res) => {
  try {
    let { email } = req.headers;
    let user = await paytmUser.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ loggedIn: true, name: user.firstName, _id: user._id });
    }
  } catch (error) {
    res.status(400).json({ error: `${error.message}` });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    let details = userZod.safeParse(req.body);
    if (!details.success) {
      res.status(400).json({ error: "Invalid details" });
    } else {
      let { firstName, lastName, email, password } = details.data;
      let ifExists = await paytmUser.findOne({ email: email });
      if (ifExists && ifExists != undefined) {
        res.status(400).json({ error: "Email taken. Try another one" });
      } else {
        let defaultBalance = 5000;
        let newUser = new paytmUser({
          firstName,
          lastName,
          email,
          password,
          defaultBalance,
        });
        let token = generateToken(
          {
            email: newUser.email,
            _id: newUser._id,
            firstName: newUser.firstName,
          },
          secretkey
        );
        await newUser.save();
        // console.log(newUser._id);
        await bank.create({
          userId: newUser,
          balance: Math.floor(Math.random() * (1000 - 1 + 1) + 1),
        });
        console.log(`User ${email} created successfully`);
        res.status(200).json({
          success: `User ${email} created successfully`,
          token: token,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: `${error.message}` });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    let details = loginZod.safeParse(req.body);
    if (details.error) {
      res.status(400).json({ error: "Invalid details" });
    }
    if (details.success) {
      let { email, password } = details.data;
      let user = await paytmUser.findOne({ email });
      if (!user) {
        res.status(400).json({ error: "User doesn't exist" });
      } else {
        if (user.password === password) {
          let token = generateToken(
            {
              email: user.email,
              _id: user._id,
              firstName: user.firstName,
            },
            secretkey
          );
          if (token) {
            console.log(`user ${email} logged in`);
            res.status(200).json({ success: `user logged in`, token: token });
          } else {
            res.status(400).json({ error: "error while setting up token" });
          }
        } else {
          res.status(401).json({ error: "Password incorrect" });
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

userRouter.put("/update", authenticate, async (req, res) => {
  try {
    let email = req.headers.email;
    let { success } = updateZod.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: "Invalid details provided" });
    }
    await paytmUser.findOneAndUpdate({ email }, req.body);
    console.log("user details updated");
    res.status(200).json({ success: `details updated for user ${email}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.get("/search", authenticate, async (req, res) => {
  try {
    let { filter } = req.query;
    let { email } = req.headers;
    if (!filter) {
      res.send(400).json({ error: "Invalid query" });
    }
    let users = await paytmUser.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    });
    if (!users) {
      res.send(400).json({ error: "No users found" });
    }
    let finalObj = [];
    users.map((each) => {
      if (each.email != email) {
        let temp = {
          UID: each._id,
          firstName: each.firstName,
          lastName: each.lastName,
          email: each.email,
        };
        finalObj.push(temp);
      }
    });

    console.log(finalObj);
    res.status(200).json({ users: finalObj });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
