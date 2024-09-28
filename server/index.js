import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
// import facultyRoutes from "./routes/facultyRoutes.js";
const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// console.log("Main File");
app.use('/api/admin', adminRoutes);  // Admin routes
app.use('/api/student', studentRoutes);  // Student routes

const PORT =5000;
app.get("/", (req, res) => {
  res.send("Hello to college erp API");
});

mongoose
  // .connect(process.env.CONNECTION_URL, {
  .connect("mongodb+srv://venugopalsingh72:6UMd3w6DxWuApRuR@cluster0.fmckz.mongodb.net/ResultManagement", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() =>
    app.listen(PORT, () => console.log(`DB connected, Server running on port ${PORT}`))
  )
  .catch((error) => console.log("Mongo Error", error.message));
