const db = require("./firebase");

async function testFirebase() {
  try {
    const docRef = await db.collection("test").add({
      name: "Tanu",
      createdAt: new Date(),
    });

    console.log("Document created with ID:", docRef.id);
  } catch (error) {
    console.error("Error:", error);
  }
}

testFirebase();
