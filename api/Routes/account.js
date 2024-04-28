const express = require("express");
const { authenticate } = require("../../Authentication/auth");
const { paytmUser, bank } = require("../../DB/mongoose");
const { default: mongoose } = require("mongoose");
const accountRouter = express.Router();

// Authentication middleware to all routes in this router
accountRouter.use(authenticate);

// Route to get account balance
accountRouter.get("/balance", async (req, res) => {
  try {
    const { email } = req.headers;
    if (!email) {
      res.status(400).json({ error: "Invalid user" });
    }

    // Find the user based on the email
    let user = await paytmUser.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid user" });
    }

    // Find the bank account associated with the user
    let account = await bank.findOne({ userId: user._id });
    if (!account) {
      res.status(400).json({ error: "Account not found" });
    }

    // Respond with the account balance
    res.json({ balance: account.balance });
  } catch (error) {
    // Handle any errors and respond with an error message
    res.status(400).json({ error: error.message });
  }
});

// Route to transfer funds between accounts
accountRouter.post("/transfer", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find the sender user based on the email
    let from = await paytmUser
      .findOne({ email: req.headers.email })
      .session(session);
    if (!from) {
      throw new Error("User not found");
    }
    let fromId = from._id;
    let { toId, amount } = req.body;

    if (typeof toId !== "string" || typeof amount !== "number" || amount < 1) {
      throw new Error("Invalid data for toId or amount");
    }
    if (!(fromId && toId && amount)) {
      // Check if required parameters are present
      throw new Error("Invalid details, unable to proceed with transaction");
    }

    // Find the sender's bank account and lock it for this transaction
    // With .session(session), you indicate that the query operation should be executed within the scope of that session.
    let fromBank = await bank.findOne({ userId: fromId }).session(session);
    if (!fromBank) {
      throw new Error("You do not have an account");
    }

    // Check if sender has sufficient balance
    if (fromBank.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Find the recipient's bank account
    let toBank = await bank.findOne({ userId: toId }).session(session);
    if (!toBank) {
      throw new Error("Recipient not found");
    }

    // Update balances for sender and recipient
    fromBank.balance -= amount;
    toBank.balance += amount;
    await fromBank.save();
    await toBank.save();

    // Commit the transaction if all steps are successful
    await session.commitTransaction();
    res.status(200).json({ success: "Transaction successfull" });
  } catch (error) {
    // End the transaction if there are any errors
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    // End the session after completing the transaction
    session.endSession();
  }
});

module.exports = accountRouter;
