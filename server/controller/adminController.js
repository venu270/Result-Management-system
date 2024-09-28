import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import Attendance from "../models/attendance.js";
import Subject from "../models/subject.js";
import Notice from "../models/notice.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import xlsx from "xlsx"; 

import fs from 'fs';
import path from 'path';

export const adminLogin = async (req, res) => {
  
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  
  try {
    const existingAdmin = await Admin.findOne({ username });
    
    if (!existingAdmin) {
      errors.usernameError = "Admin doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }
    
    const token = jwt.sign(
      {
        username: existingAdmin.username,
        id: existingAdmin._id,
      },
      "Authentication00",
      { expiresIn: "1h" }
    );
    // console.log(existingAdmin);
    res.status(200).json({ result: existingAdmin, token: token });
  } catch (error) {
    console.log(error);
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const admin = await Admin.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    if (admin.passwordUpdated === false) {
      admin.passwordUpdated = true;
      await admin.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: admin,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const updateAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email } = req.body;
    const updatedAdmin = await Admin.findOne({ email });
    if (name) {
      updatedAdmin.name = name;
      await updatedAdmin.save();
    }
    if (dob) {
      updatedAdmin.dob = dob;
      await updatedAdmin.save();
    }
    if (department) {
      updatedAdmin.department = department;
      await updatedAdmin.save();
    }
    if (contactNumber) {
      updatedAdmin.contactNumber = contactNumber;
      await updatedAdmin.save();
    }
    if (avatar) {
      updatedAdmin.avatar = avatar;
      await updatedAdmin.save();
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { name, dob, username, password, contactNumber, avatar, email, joiningYear } =
      req.body;
    const errors = { emailError: String };
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    // const existingDepartment = await Department.findOne({ department });
    // let departmentHelper = existingDepartment.departmentCode;
    const admins = await Admin.find({email});

    let helper;
    if (admins.length < 10) {
      helper = "00" + admins.length.toString();
    } else if (admins.length < 100 && admins.length > 9) {
      helper = "0" + admins.length.toString();
    } else {
      helper = admins.length.toString();
    }
    var date = new Date();
    var components = ["ADM", date.getFullYear(), helper];

    // var username = components.join("");
    let hashedPassword;
    const newDob = username+"@"+dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(password, 10);
    var passwordUpdated = false;
    const newAdmin = await new Admin({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      // department,
      avatar,
      contactNumber,
      dob,
      passwordUpdated,
    });
    await newAdmin.save();
    return res.status(200).json({
      success: true,
      message: "Admin registerd successfully",
      response: newAdmin,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

// export const createNotice = async (req, res) => {
//   try {
//     const { from, content, topic, date, noticeFor } = req.body;

//     const errors = { noticeError: String };
//     const exisitingNotice = await Notice.findOne({ topic, content, date });
//     if (exisitingNotice) {
//       errors.noticeError = "Notice already created";
//       return res.status(400).json(errors);
//     }
//     const newNotice = await new Notice({
//       from,
//       content,
//       topic,
//       noticeFor,
//       date,
//     });
//     await newNotice.save();
//     return res.status(200).json({
//       success: true,
//       message: "Notice created successfully",
//       response: newNotice,
//     });
//   } catch (error) {
//     const errors = { backendError: String };
//     errors.backendError = error;
//     res.status(500).json(errors);
//   }
// };

export const addDepartment = async (req, res) => {
  try {
    const errors = { departmentError: String };
    const { department } = req.body;
    const existingDepartment = await Department.findOne({ department });
    if (existingDepartment) {
      errors.departmentError = "Department already added";
      return res.status(400).json(errors);
    }
    const departments = await Department.find({});
    let add = departments.length + 1;
    let departmentCode;
    if (add < 9) {
      departmentCode = "0" + add.toString();
    } else {
      departmentCode = add.toString();
    }

    const newDepartment = await new Department({
      department,
      departmentCode,
    });

    await newDepartment.save();
    return res.status(200).json({
      success: true,
      message: "Department added successfully",
      response: newDepartment,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

// export const addFaculty = async (req, res) => {
//   try {
//     const {
//       name,
//       username,
//       dob,
//       department,
//       contactNumber,
//       password,
//       avatar,
//       email,
//       joiningYear,
//       gender,
//       designation,
//     } = req.body;
//     const errors = { emailError: String };
//     const existingFaculty = await Faculty.findOne({ email });
//     if (existingFaculty) {
//       errors.emailError = "Email already exists";
//       return res.status(400).json(errors);
//     }

//     const existingDepartment = await Department.findOne({ department });
//     let departmentHelper = existingDepartment?.departmentCode;

//     const faculties = await Faculty.find({ department });
//     let helper;
//     if (faculties.length < 10) {
//       helper = "00" + faculties.length.toString();
//     } else if (faculties.length < 100 && faculties.length > 9) {
//       helper = "0" + faculties.length.toString();
//     } else {
//       helper = faculties.length.toString();
//     }
//     var date = new Date();
//     var components = ["FAC", date.getFullYear(), departmentHelper, helper];

//     var registrationNumber = components.join("");
//     let hashedPassword;
//     const newDob = username+"@"+dob.split("-").reverse().join("-");

//     hashedPassword = await bcrypt.hash(password, 10);
//     var passwordUpdated = false;


//     const newFaculty = await new Faculty({
//       name,
//       username,
//       email,
//       password: hashedPassword,
//       joiningYear,
//       registrationNumber: registrationNumber,
//       department,
//       avatar,
//       contactNumber,
//       dob,
//       gender,
//       designation,
//       passwordUpdated,
//     });
//     await newFaculty.save();
//     return res.status(200).json({
//       success: true,
//       message: "Faculty registerd successfully",
//       response: newFaculty,
//     });
//   } catch (error) {
//     const errors = { backendError: String };
//     errors.backendError = error;
//     res.status(500).json(errors);
//   }
// };

// export const getFaculty = async (req, res) => {
//   try {
//     const { department } = req.body;
//     const errors = { noFacultyError: String };
//     const faculties = await Faculty.find({ department });
//     if (faculties.length === 0) {
//       errors.noFacultyError = "No Faculty Found";
//       return res.status(404).json(errors);
//     }
//     res.status(200).json({ result: faculties });
//   } catch (error) {
//     const errors = { backendError: String };
//     errors.backendError = error;
//     res.status(500).json(errors);
//   }
// };
// export const getNotice = async (req, res) => {
//   try {
//     const errors = { noNoticeError: String };
//     const notices = await Notice.find({});
//     if (notices.length === 0) {
//       errors.noNoticeError = "No Notice Found";
//       return res.status(404).json(errors);
//     }
//     res.status(200).json({ result: notices });
//   } catch (error) {
//     const errors = { backendError: String };
//     errors.backendError = error;
//     res.status(500).json(errors);
//   }
// };

export const addSubject = async (req, res) => {
  try {
    const { totalLectures, department, subjectCode, subjectName, year, semester } =
      req.body;
    const errors = { subjectError: String };
    const subject = await Subject.findOne({ subjectCode });
    if (subject) {
      errors.subjectError = "Given Subject is already added";
      let AR=res.status(400).json(errors);
      console.log(AR);
      // return res.status(400).json(errors);
    }

    const newSubject = await new Subject({
      totalLectures,
      department,
      subjectCode,
      subjectName,
      year,
      semester
    });

    await newSubject.save();
    const students = await Student.find({ department, year, semester });
    if (students.length !== 0) {
      for (var i = 0; i < students.length; i++) {
        students[i].subjects.push(newSubject._id);
        await students[i].save();
      }
    }
    return res.status(200).json({
      success: true,
      message: "Subject added successfully",
      response: newSubject,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getSubject = async (req, res) => {
  try {
    const { department, year, semester } = req.body;

    if (!req.userId) return res.json({ message: "Unauthenticated" });
    const errors = { noSubjectError: String };

    const subjects = await Subject.find({ department, year, semester });
    if (subjects.length === 0) {
      errors.noSubjectError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: subjects });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getSubjectCount = async (req, res) => {
  try {
    const { } = req.body;

    if (!req.userId) return res.json({ message: "Unauthenticated" });
    const errors = { noSubjectError: String };

    const subjects = await Subject.count();
    if (subjects.length === 0) {
      errors.noSubjectError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: subjects });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getAdmin = async (req, res) => {
  try {
    const { department } = req.body;

    const errors = { noAdminError: String };

    const admins = await Admin.find({ department });
    if (admins.length === 0) {
      errors.noAdminError = "No Admins Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: admins });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admins = req.body;
    const errors = { noAdminError: String };
    for (var i = 0; i < admins.length; i++) {
      var admin = admins[i];
   
      await Admin.findOneAndDelete({ _id: admin });
    }
    res.status(200).json({ message: "Admin Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
// export const deleteFaculty = async (req, res) => {
//   try {
//     const faculties = req.body;
//     const errors = { noFacultyError: String };
//     for (var i = 0; i < faculties.length; i++) {
//       var faculty = faculties[i];
 
//       await Faculty.findOneAndDelete({ _id: faculty });
//     }
//     res.status(200).json({ message: "Faculty Deleted" });
//   } catch (error) {
//     const errors = { backendError: String };
//     errors.backendError = error;
//     res.status(500).json(errors);
//   }
// };
export const deleteStudent = async (req, res) => {
  try {
    const students = req.body;
    const errors = { noStudentError: String };
    for (var i = 0; i < students.length; i++) {
      var student = students[i];
   
      await Student.findOneAndDelete({ _id: student });
    }
    res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteSubject = async (req, res) => {
  try {
    const subjects = req.body;
    const errors = { noSubjectError: String };
    for (var i = 0; i < subjects.length; i++) {
      var subject = subjects[i];

      await Subject.findOneAndDelete({ _id: subject });
    }
    res.status(200).json({ message: "Subject Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    await Department.findOneAndDelete({ department });

    res.status(200).json({ message: "Department Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

const generateSubjectCode = (subjectName, flag=1) => {
  if(subjectName=="Math"){
    if(flag==1){
      return "100";
    }
    else{
      return "Mathematics"
    }
  }
  else if(subjectName=="Chemistry"){
    if(flag==1){
      return "101";
    }
    else{
      return "Department of Chemistry"
    }
  }
  else if(subjectName=="Science"){
    if(flag==1){
      return "102";
    }
    else{
      return "Faculty of Science";
    }
  }
  else if(subjectName=="History"){
    if(flag==1){
      return "103";
    }
    else{
      return "Department of History";
    }
  }
  else if(subjectName=="English"){
    if(flag==1){
      return "104";
    }
    else{
      return "Department of English & Literature"
    }
  }
  else{
    if(flag==1){
      return "105";
    }
    else{
      return "Comman Department"
    }
  }
}

export const addStudent = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      dob,
      department,
      semester,
      contactNumber,
      email,
      division,
      gender,
      batch,
      fatherName,
      joiningYear,
      subjects,
    } = req.body;
    const avatar = "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg";
    const errors = { emailError: String };
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    const existingDepartment = await Department.findOne({ department });
    let departmentHelper = existingDepartment?.departmentCode;

    const students = await Student.find({ department });
    let helper;
    if (students.length < 10) {
      helper = "00" + students.length.toString();
    } else if (students.length < 100 && students.length > 9) {
      helper = "0" + students.length.toString();
    } else {
      helper = students.length.toString();
    }
    var date = new Date();
    var components = ["STU", date.getFullYear(), departmentHelper, helper];

    var registrationNumber = components.join("");
    let hashedPassword;
    const newDob = username+"@"+dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(password, 10);
    var passwordUpdated = false;

    const subjectIds = [];
    for (const subjectName of subjects) {
      let subject = await Subject.findOne({ subjectName });
      if (!subject) {
        // Handle case where subject does not exist
        subject = new Subject({
          subjectName,
          subjectCode: generateSubjectCode(subjectName), // Implement this function
          department : generateSubjectCode(subjectName, -1),
          year: "2000", // Adjust as needed
          semester: "1" // Adjust as needed
        });
        await subject.save();
      }
      subjectIds.push(subject._id);
    }

    const newStudent = await new Student({
      name,
      dob,
      password: hashedPassword,
      registrationNumber: registrationNumber,
      username,
      department,
      contactNumber,
      avatar,
      email,
      semester,
      division,
      gender,
      joiningYear,
      batch,
      fatherName,
      subjects : subjectIds,
      passwordUpdated,
    });
    await newStudent.save();
    // const subjectss = await Subject.find({ department, year });
    // if (subjectss.length !== 0) {
    //   for (var i = 0; i < subjects.length; i++) {
    //     newStudent.subjects.push(subjects[i]._id);
    //   }
    // }
    // await newStudent.save();
    return res.status(200).json({
      success: true,
      message: "Student registerd successfully",
      response: newStudent,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getStudent = async (req, res) => {
  try {
    const { department, year, academicYear } = req.body;
    const errors = { noStudentError: String };
    const students = await Student.find({ department, year , academicYear });

    if (students.length === 0) {
      errors.noStudentError = "No Student Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: students });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const getAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const getAllSubject = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const uploadAttendance = async (req, res) => {
  try {
    console.log(req.file); // Debugging to check file details

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Process the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const record of sheetData) {
      const { Email, Name, Attendance: status } = record;

      console.log(`Processing student: ${Name}, Email: ${Email}`); // Debugging

      // Check if student exists
      const student = await Student.findOne({ email: Email, name: Name });
      
      if (student) {
        console.log(`Found student: ${student.name}, adding attendance`); // Debugging
        
        // Add attendance data with student's name and email
        await Attendance.create({
          studentId: student._id,
          name: student.name,
          email: student.email,
          date: new Date(), // or provide an actual date from Excel if applicable
          status
        });

        console.log('Attendance record created'); // Debugging
      } else {
        console.log(`Student not found: ${Name}, ${Email}`); // Debugging
      }
    }

    res.status(200).json({ message: 'Attendance uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading attendance' });
  }
};

// Fetch all attendance records
export const getAllAttendance = async (req, res) => {
  try {
    console.log("Fetching all attendance records...");
    const attendanceRecords = await Attendance.find().populate('studentId');

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    console.log("Attendance records fetched successfully:", attendanceRecords);
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
};


// Fetch attendance record by ID
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching attendance record for ID: ${id}`);

    const attendanceRecord = await Attendance.findById(id).populate('studentId');

    if (!attendanceRecord) {
      console.log(`Attendance record with ID: ${id} not found`);
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    console.log("Attendance record fetched successfully:", attendanceRecord);
    res.status(200).json(attendanceRecord);
  } catch (error) {
    console.error(`Error fetching attendance record for ID: ${id}`, error);
    res.status(500).json({ message: 'Error fetching attendance record' });
  }
};


// Update attendance record by ID
// Function to update attendance record by ID
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params; // Get attendance record ID from request parameters
    const { date, status } = req.body; // Get date and status from request body

    console.log("Updating attendance for ID: ", id);
    console.log("New date: ", date);
    console.log("New status: ", status);

    // Check if all required fields are present
    if (!date || !status) {
      console.error("Missing fields: date or status");
      return res.status(400).json({ message: 'Missing date or status fields' });
    }

    // Attempt to find and update the attendance record
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id, // Find attendance by ID
      { $set: { date, status } }, // Update fields
      { new: true } // Return the updated document
    );

    if (!updatedAttendance) {
      console.error(`Attendance record with ID: ${id} not found`);
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Success: return the updated attendance record
    console.log("Attendance updated successfully: ", updatedAttendance);
    res.status(200).json(updatedAttendance);

  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating attendance record: ", error);
    res.status(500).json({ message: 'Error updating attendance record' });
  }
};

// Function to delete attendance record by ID
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting attendance record' });
  }
};


export const uploadMarks = async (req, res) =>{
  try {
    const { id } = req.params;
    const { marks } = req.body;

    // Validate that marks are provided
    if (marks === undefined) {
      return res.status(400).json({ message: 'Marks are required' });
    }

    const updatedMarks = await Attendance.findByIdAndUpdate(
      id,
      { marks },
      { new: true }
    );

    if (!updatedMarks) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    return res.status(200).json({ message: 'Marks uploaded successfully', updatedMarks });
  } catch (error) {
    console.error('Error uploading marks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

};



//marks ko upload krna hai?
//side bar mai option dalna hai UploadMarks.js, uske baad App.js file mai path add krna hai
//basic upload page banana hai.
//make sure the file we get it should have the correct student details, after uploading then it should be added to the database(including their name and email)
