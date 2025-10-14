let express = require("express");
let mongoose = require("mongoose");
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
require("dotenv").config();

const port = process.env.PORT || 3000;
// let MongoURL = "mongodb://127.0.0.1:27017/eLearning";

let MongoURL = process.env.MONGODB_URI;

main()
  .then(console.log("connected to db"))
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MongoURL);
}

let commentSchema = mongoose.Schema({
  name: String,
  image: {
    type: String,
    default:
      "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp",

    set: (v) =>
      v === ""
        ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
        : v,
  },
  rating: Number,
  comment: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

let Feedback = mongoose.model("Feedback", commentSchema);

let userProgressSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  activeCourses: { type: [String], default: [] },
  completedCourses: { type: [String], default: [] },
  hoursLearned: { type: Number, default: 0 },
  dayStreak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
});

let UserProgress = mongoose.model("UserProgress", userProgressSchema);

app.post("/feedback/new", async (req, res) => {
  try {
    console.log("Received feedback request:", req.body);
    let { name, image, rating, comment, date } = req.body;
    let newFeedback = new Feedback({ name, image, rating, comment, date });
    let savedFeedback = await newFeedback.save();
    console.log("Feedback saved:", savedFeedback);
    res.json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ success: false, message: "Error submitting feedback" });
  }
});

app.get("/feedback", async (req, res) => {
  let data = await Feedback.find({});
  // console.log(data);
  res.send(data);
});

app.get("/feedback/:id", async (req, res) => {
  let { id } = req.params;
  let data = await Feedback.findOneAndDelete({ _id: id });
  // console.log(data);
  res.redirect("https://e-learning-six-iota.vercel.app/feedback");
});

app.get("/progress/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId });
      await progress.save();
    }
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching progress" });
  }
});

app.post("/progress", async (req, res) => {
  try {
    let { userId, activeCourses, completedCourses, hoursLearned, dayStreak, lastLogin } = req.body;
    let progress = await UserProgress.findOneAndUpdate(
      { userId },
      { activeCourses, completedCourses, hoursLearned, dayStreak, lastLogin },
      { new: true, upsert: true }
    );
    res.json({ success: true, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating progress" });
  }
});

app.put("/progress/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    let updateData = req.body;
    let progress = await UserProgress.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating progress" });
  }
});

app.put("/progress/reset/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    let resetProgress = {
      userId,
      activeCourses: [],
      completedCourses: [],
      hoursLearned: 0,
      dayStreak: 0,
      lastLogin: new Date()
    };
    await UserProgress.findOneAndUpdate({ userId }, resetProgress, { upsert: true });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error resetting progress" });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
