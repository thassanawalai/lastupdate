const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

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
    // คำนวณ level
    let level = null;
    const results = req.body.results || {};

    // ระดับ 1: st5 <= 7
    if (results.st5 && typeof results.st5.score === "number" && results.st5.score <= 7) {
      level = 1;
    }
    // ระดับ 2: 2Q score = 0 (และยังไม่ถึง 9Q)
    else if (results.twoQ && typeof results.twoQ.score === "number" && results.twoQ.score === 0) {
      level = 2;
    }
    // ระดับ 3: ทำถึง 9Q (มี results.nineQ)
    else if (results.nineQ) {
      level = 3;
    }

    let result;
    if (req.body._id) {
      // อัปเดต record เดิม
      result = await Response.findByIdAndUpdate(
        req.body._id,
        { $set: { personalInfo: req.body.personalInfo, results: req.body.results, level } },
        { new: true }
      );
      res.json({ success: true, _id: result._id });
    } else {
      // สร้างใหม่
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