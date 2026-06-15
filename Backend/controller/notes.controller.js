const express = require("express");
const router = express.Router();

const {db} = require("../firebase");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("data", req.body);
    const { title, content } = req.body;

    const noteRef = await db.collection("notes").add({
      title,
      content,
      userId: req.user.uid,
      createdAt: new Date(),
    });
    res.status(201).json({
      success: true,
      noteId: noteRef.id,
    });
  } 
  
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db
      .collection("notes")
      .where("userId", "==", req.user.uid)
      .get();

    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const doc = await db.collection("notes").doc(req.params.id).get();

    if(!doc.exists){
        return res.status(404).json({
            message:"Notes not found",
        });
    }
    const note = doc.data();
    if(note.userId !== req.user.uid){
        return res.status(403).json({
            message: "Forbidden",
        });
    }
    res.json({
        id:doc.id,
        ...note,
    });
  } 
  
  catch (error) {
    res.status(500).json({
        message:error.message,
    });
  }
});



router.put("/:id", authMiddleware, async (req,res)=>{
    try{
        const noteRef = db.collection("notes").doc(req.params.id);

        const doc = await noteRef.get();

        if(!doc.exists){
            return res.status(404).json({
                message: "Note not found",
            });
        }
        const note = doc.data();


        if(note.userId !== req.user.uid){
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        await noteRef.update({
            title: req.body.title,
            content: req.body.content,
        });
        res.json({
            success: true,
            message:"updated successfully",
        });
    }
    catch(error){
        res.status(500).json({
            message: error.message,
        });

    }
});



router.delete("/:id", authMiddleware, async(req,res) =>{
    try{
        const noteRef = db.collection("notes").doc(req.params.id);

        const doc = await noteRef.get();

        if(!doc.exists){
            return res.status(404).json({
                message: "Notes not found",
            });
        }
        const note = doc.data();

        if(note.userId !== req.user.uid){
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        await noteRef.delete();

        res.json({
            success: true,
            message: "deleted successfully",
        });

    }
    catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
});




module.exports = router;
