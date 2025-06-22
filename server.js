const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas URI (ไม่ใช้ .env)
const mongoURI = "mongodb+srv://nurse:12345@cluster0.civ9skf.mongodb.net/nurse-survey?retryWrites=true&w=majority&appName=Cluster0";

// เชื่อมต่อ MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB Atlas"));

// Schema
const responseSchema = new mongoose.Schema({
  personalInfo: {
    nickname: String,
    age: String,
    gender: String,
    occupation: String
  },
  results: mongoose.Schema.Types.Mixed,
  level: Number, // เพิ่ม field นี้
  createdAt: { type: Date, default: Date.now }
});
const Response = mongoose.model("surveys", responseSchema);

// Route
app.post('/submit', async (req, res) => {
  try {
    let level = null;
    const results = req.body.results || {};
    const st5Score = results.st5 ? Number(results.st5.score) : null;

    // ระดับ 3: ทำถึง 9Q (มี results.nineQ)
    if (results.nineQ) {
      level = 3;
    }
    // ระดับ 2: st5 > 7 หรือ twoQ.hasDepression === false
    else if (
      (results.st5 && !isNaN(st5Score) && st5Score > 7) ||
      (results.twoQ && results.twoQ.hasDepression === false)
    ) {
      level = 2;
    }
    // ระดับ 1: st5 <= 7 หรือไม่มีคะแนนเลย
    else if (
      (results.st5 && !isNaN(st5Score) && st5Score <= 7) ||
      (typeof results.st5 === "undefined")
    ) {
      level = 1;
    }

    let result;
    if (req.body._id) {
      result = await Response.findByIdAndUpdate(
        req.body._id,
        { $set: { personalInfo: req.body.personalInfo, results: req.body.results, level } },
        { new: true }
      );
      res.json({ success: true, _id: result._id });
    } else {
      const submission = new Response({
        personalInfo: req.body.personalInfo,
        results: req.body.results,
        level
      });
      await submission.save();
      res.json({ success: true, insertedId: submission._id });
    }
  } catch (err) {
    console.error('❌ Error saving data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});