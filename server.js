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
  q1: Number,
  q2: Number,
  q3: Number,
  q4: Number,
  q5: Number,
  q6: Number,
  q7: Number,
  q8: Number,
  q9: Number,
  createdAt: { type: Date, default: Date.now },
});
const Response = mongoose.model("Response", responseSchema);

// Schema สำหรับข้อมูลแบบใหม่ (personalInfo + results)
const surveySchema = new mongoose.Schema({
  personalInfo: {
    nickname: String,
    age: String,
    gender: String,
    occupation: String
  },
  results: mongoose.Schema.Types.Mixed, // รองรับผลประเมินทุกรูปแบบ
  createdAt: { type: Date, default: Date.now },
});
const Survey = mongoose.model("Survey", surveySchema);

// Route
app.post("/submit", async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    await newSurvey.save();
    res.status(200).json({ message: "✅ ส่งข้อมูลเรียบร้อยแล้ว" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});