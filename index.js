const express = require("express");
const authMiddleware = require("./Middleware/authMiddleware");

const app = express();

app.get("/", (req, res) => {
  res.send("Public Route");
});

app.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});