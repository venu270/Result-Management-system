// facultyController.js

import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendance from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = "Authentication00"; // Define your secret key here

// Faculty Login
export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: "", passwordError: "" };
  try {
    const existingFaculty = await Faculty.findOne({ username });
    if (!existingFaculty) {
      errors.usernameError = "Faculty doesn't exist.";
      return res.status(401).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingFaculty.password);
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(401).json(errors);
    }

    const token = jwt.sign(
      { email: existingFaculty.email, id: existingFaculty._id },
      JWT_SECRET, // Use the directly defined secret key
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingFaculty, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Update Password
export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: "" };
    if (newPassword !== confirmPassword) {
      errors.mismatchError = "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const faculty = await Faculty.findOne({ email });
    if (!faculty) return res.status(404).json({ message: "Faculty not found." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    faculty.password = hashedPassword;
    faculty.passwordUpdated = true; // update passwordUpdated field
    await faculty.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: faculty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update Faculty Details
export const updateFaculty = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, designation } = req.body;
    const updatedFaculty = await Faculty.findOne({ email });
    if (!updatedFaculty) return res.status(404).json({ message: "Faculty not found." });

    if (name) updatedFaculty.name = name;
    if (dob) updatedFaculty.dob = dob;
    if (department) updatedFaculty.department = department;
    if (contactNumber) updatedFaculty.contactNumber = contactNumber;
    if (designation) updatedFaculty.designation = designation;
    if (avatar) updatedFaculty.avatar = avatar;
    await updatedFaculty.save();

    res.status(200).json(updatedFaculty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Create Test
export const createTest = async (req, res) => {
  try {
    const { subjectCode, department, year, semester, division, date, test, totalMarks } = req.body;
    const errors = { testError: "" };
    const existingTest = await Test.findOne({
      subjectCode,
      department,
      year,
      semester,
      division,
      test,
    });
    if (existingTest) {
      errors.testError = "Given Test is already created";
      return res.status(400).json(errors);
    }

    const newTest = new Test({
      totalMarks,
      division,
      test,
      date,
      department,
      subjectCode,
      year,
      semester,
    });

    await newTest.save();
    res.status(200).json({
      success: true,
      message: "Test added successfully",
      response: newTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get Tests
export const getTest = async (req, res) => {
  try {
    const { department, year, semester, division } = req.body;
    const tests = await Test.find({ department, year, semester, division });
    res.status(200).json({ result: tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get Students
export const getStudent = async (req, res) => {
  try {
    const { department, year, semester, division } = req.body;
    const errors = { noStudentError: "" };
    const students = await Student.find({ department, year, semester, division });
    if (students.length === 0) {
      errors.noStudentError = "No Student Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Upload Marks
export const uploadMarks = async (req, res) => {
  try {
    const { department, year, division, test, subjectCode, marks } = req.body;

    const errors = { examError: "" };
    const existingTest = await Test.findOne({
      department,
      year,
      division,
      test,
      subjectCode,
    });

    if (!existingTest) {
      errors.examError = "Test not found";
      return res.status(404).json(errors);
    }

    const isAlready = await Marks.find({ exam: existingTest._id });

    if (isAlready.length !== 0) {
      errors.examError = "You have already uploaded marks of given exam";
      return res.status(400).json(errors);
    }

    for (let i = 0; i < marks.length; i++) {
      const newMarks = new Marks({
        student: marks[i]._id,
        exam: existingTest._id,
        marks: marks[i].value,
      });
      await newMarks.save();
    }
    res.status(200).json({ message: "Marks uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Mark Attendance
export const markAttendance = async (req, res) => {
  try {
    const { selectedStudents, subjectName, department, year, division } = req.body;

    const subject = await Subject.findOne({ subjectName });
    if (!subject) return res.status(404).json({ message: "Subject not found." });

    const allStudents = await Student.find({ department, year, division });

    for (let i = 0; i < allStudents.length; i++) {
      const pre = await Attendance.findOne({
        student: allStudents[i]._id,
        subject: subject._id,
      });
      if (!pre) {
        const attendance = new Attendance({
          student: allStudents[i]._id,
          subject: subject._id,
          totalLecturesByFaculty: 1,
        });
        await attendance.save();
      } else {
        pre.totalLecturesByFaculty += 1;
        await pre.save();
      }
    }

    for (let a = 0; a < selectedStudents.length; a++) {
      const pre = await Attendance.findOne({
        student: selectedStudents[a],
        subject: subject._id,
      });
      if (!pre) {
        const attendance = new Attendance({
          student: selectedStudents[a],
          subject: subject._id,
          lectureAttended: 1,
        });
        await attendance.save();
      } else {
        pre.lectureAttended += 1;
        await pre.save();
      }
    }

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};