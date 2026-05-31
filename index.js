const express = require("express");
const authMiddleware = require("./Middleware/authMiddleware");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.get("/profile",authMiddleware,(req, res) => {
  res.json({
    message:"Protected Route Accessed",
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});