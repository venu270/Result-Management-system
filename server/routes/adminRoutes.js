import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import { 
  adminLogin,
  updateAdmin,
  addAdmin,
  addSubject,
  getSubject,
  getSubjectCount,
  addStudent,
  getStudent,
  addDepartment,
  getAllStudent,
  getAllAdmin,
  getAllDepartment,
  getAllSubject,
  updatedPassword,
  getAdmin,
  deleteAdmin,
  deleteDepartment,
  deleteStudent,
  deleteSubject,
  uploadAttendance,
  updateAttendance,
  getAllAttendance,
  getAttendanceById // Import the attendance controller function
} from "../controller/adminController.js";
import upload from "../middleware/uploadMiddleware.js"; // Multer middleware for handling file uploads

const router = express.Router();

// Define your routes
router.get("/", (req, res) => {
  res.send("Admin API Home"); // This will respond to a GET request on /api/admin
});

router.post("/login", adminLogin);
router.post("/updatepassword", auth, updatedPassword);
router.get("/getallstudent", auth, getAllStudent);
router.get("/getalldepartment", auth, getAllDepartment);
router.get("/getallsubject", auth, getAllSubject);
router.get("/getalladmin", auth, getAllAdmin);
router.post("/updateprofile", auth, updateAdmin);
router.post("/addadmin", addAdmin);
router.post("/adddepartment", auth, addDepartment);
router.post("/addsubject", addSubject);
router.post("/getsubject", auth, getSubject);
router.post("/getsubjectcount", auth, getSubjectCount);
router.post("/addstudent", addStudent);
router.post("/getstudent", auth, getStudent);
router.post("/getadmin", auth, getAdmin);
router.post("/deleteadmin", auth, deleteAdmin);
router.post("/deletestudent", auth, deleteStudent);
router.post("/deletedepartment", auth, deleteDepartment);
router.post("/deletesubject", auth, deleteSubject);

// Use the imported upload middleware for handling file uploads
router.post('/upload-attendance', upload.single('file'), uploadAttendance);

// Use PATCH or PUT for updating attendance by ID
router.patch('/update-attendance/:id', auth, updateAttendance);

// Use GET for retrieving attendance data
router.get('/get-attendance', auth, getAllAttendance);
router.get('/get-attendance/:id', auth, getAttendanceById);

export default router;
