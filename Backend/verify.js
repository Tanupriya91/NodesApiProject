const admin = require("./firebase");
const fs = require("fs");

async function test() {
  try {
    const token = fs.readFileSync("token.txt", "utf8").trim();

    console.log("File Length:", token.length);
    console.log("File Parts:", token.split(".").length);
    console.log("File Last 20:", token.slice(-20));

    const decoded = await admin.auth().verifyIdToken(token);

    console.log("SUCCESS");
    console.log(decoded.uid);
  } catch (err) {
    console.error(err);
  }
}

test();