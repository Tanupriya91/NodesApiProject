const {admin} = require("../firebase");

const authMidddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "no token found",
        code: 401,
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split("Bearer ")[1].trim()
      : authHeader.trim();

    const decodeToken = await admin.auth().verifyIdToken(token);
    req.user = decodeToken;
    next();
  } catch (error) {
    console.log("Error message", error.message);
    return res.status(401).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }
};

module.exports = authMidddleware;
