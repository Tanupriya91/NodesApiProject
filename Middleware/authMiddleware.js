const admin = require("../firebase"); // adjust path if needed

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split("Bearer ")[1].trim()
      : authHeader.trim();

   console.log("Received Length:", token.length);
console.log("Parts:", token.split(".").length);
console.log("Last 20:", token.slice(-20));

    const decodedToken = await admin.auth().verifyIdToken(token);

    console.log("User authenticated:", decodedToken.uid);

    req.user = decodedToken;

    next();
  } catch (error) {
   
    console.error("Full Error:", error);
    

    return res.status(401).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }
};

module.exports = authMiddleware;